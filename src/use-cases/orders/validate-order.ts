import { prisma } from "@/lib/prisma";
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

      // ⏳ Verifica expiração (96 horas)
      const hoursDiff = differenceInHours(new Date(), order.createdAt);
      if (hoursDiff > 360) {
        await this.ordersRepository.updateStatusWithTx(
          tx,
          order.id,
          OrderStatus.EXPIRED,
        );
        throw new Error("Pedido expirado.");
      }

      // ✅ Valida pedido
      const updated = await tx.order.updateMany({
        where: {
          id: order.id,
          status: OrderStatus.PENDING,
        },
        data: {
          status: OrderStatus.VALIDATED,
          validatedAt: new Date(),
        },
      });

      if (updated.count === 0) {
        throw new Error("Pedido já validado por outro operador.");
      }

      // 📦 Atualiza estoque
      for (const item of order.items) {
        await this.productsRepository.updateStockWithTx(
          tx,
          item.product.id,
          Number(item.quantity),
        );
      }

      // 🪙 calcula pontos (1 ponto a cada 10 reais pagos)
      const valorPago =
        Number(order.totalAmount) - Number(order.discountApplied || 0);

      const pointsEarned = Math.floor(valorPago / 10);

      if (pointsEarned > 0) {
        // 🔎 busca carteira
        let wallet = await tx.storePointsWallet.findUnique({
          where: {
            userId_storeId: {
              userId: order.userId,
              storeId: order.storeId,
            },
          },
        });

        // 🏦 cria carteira se não existir
        if (!wallet) {
          wallet = await tx.storePointsWallet.create({
            data: {
              userId: order.userId,
              storeId: order.storeId,
            },
          });
        }

        // 📄 cria transação de pontos
        await tx.storePointsTransaction.create({
          data: {
            userId: order.userId,
            storeId: order.storeId,
            orderId: order.id,
            type: "EARN",
            points: pointsEarned,
            note: "Pontos gerados por validação de pedido",
            storePointsWalletId: wallet.id, // 🔥 ESSENCIAL
          },
        });

        // ➕ atualiza saldo
        await tx.storePointsWallet.update({
          where: {
            userId_storeId: {
              userId: order.userId,
              storeId: order.storeId,
            },
          },
          data: {
            balance: { increment: pointsEarned },
            earned: { increment: pointsEarned },
          },
        });
      }

      return {
        orderId: order.id,
        status: OrderStatus.VALIDATED,
        pointsEarned,
      };
    });
  }
}
