import { prisma } from "@/lib/prisma";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { CashbackTransactionsRepository } from "@/repositories/prisma/Iprisma/cashback-transations-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";
import { differenceInHours } from "date-fns";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";

interface ValidateOrderUseCaseRequest {
  orderId: string;
  storeId: string;
}

export class ValidateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private cashbacksRepository: CashbacksRepository,
    private cashbackTransactionsRepository: CashbackTransactionsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({ orderId, storeId }: ValidateOrderUseCaseRequest) {
    return prisma.$transaction(async (tx) => {
      const order = await this.ordersRepository.findByIdWithTx(tx, orderId);

      if (!order) throw new Error("Pedido não encontrado.");
      if (order.storeId !== storeId)
        throw new Error("Sem permissão para validar este pedido.");
      if (order.status !== OrderStatus.PENDING)
        throw new Error("Pedido já processado.");

      const hoursDiff = differenceInHours(new Date(), order.createdAt);
      if (hoursDiff > 96) {
        await this.ordersRepository.updateStatusWithTx(
          tx,
          order.id,
          OrderStatus.EXPIRED,
        );
        throw new Error("Pedido expirado.");
      }

      // ✅ calcula cashback a partir dos itens
      let cashbackAmount = 0;

      if (Number(order.discountApplied) === 0) {
        for (const item of order.items) {
          const percentual = item.product.cashbackPercentage;
          const subtotal = Number(item.product.price) * Number(item.quantity);

          cashbackAmount += subtotal * (percentual / 100);
        }
      }

      // 1️⃣ valida pedido
      await this.ordersRepository.markAsValidatedWithTx(tx, order.id);

      // 1️⃣ cria saldo
      await this.cashbacksRepository.createConfirmedCashbackWithTx(tx, {
        userId: order.userId,
        storeId: order.storeId,
        orderId: order.id,
        amount: cashbackAmount,
        status: OrderStatus.VALIDATED,
      });

      for (const item of order.items) {
        await this.productsRepository.updateStockWithTx(
          tx,
          item.product.id,
          Number(item.quantity),
        );
      }

      // 2️⃣ cria transação (única fonte de saldo)
      if (cashbackAmount > 0) {
        await this.cashbackTransactionsRepository.createWithTx(tx, {
          userId: order.userId,
          storeId: order.storeId,
          amount: cashbackAmount,
          type: "RECEIVE",
          orderId: order.id,
        });
      }

      return {
        orderId: order.id,
        status: OrderStatus.VALIDATED,
        cashbackCredited: cashbackAmount,
      };
    });
  }
}
