import { prisma } from "@/lib/prisma";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { CashbackTransactionsRepository } from "@/repositories/prisma/Iprisma/cashback-transations-repository";
import { OrderStatus } from "@prisma/client";
import { differenceInHours } from "date-fns";

interface ValidateOrderUseCaseRequest {
  orderId: string;
  storeId: string;
}

export class ValidateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private cashbacksRepository: CashbacksRepository,
    private cashbackTransactionsRepository: CashbackTransactionsRepository,
  ) {}

  async execute({ orderId, storeId }: ValidateOrderUseCaseRequest) {
    return prisma.$transaction(async (tx) => {
      /**
       * 🔎 1. Busca pedido COM LOCK lógico (via status)
       */
      const order = await this.ordersRepository.findByIdWithTx(tx, orderId);

      if (!order) {
        throw new Error("Pedido não encontrado.");
      }

      // 🔐 Loja dona do pedido
      if (order.store_id !== storeId) {
        throw new Error("Você não tem permissão para validar este pedido.");
      }

      /**
       * 🛑 Idempotência
       */
      if (order.status !== OrderStatus.PENDING) {
        throw new Error("Este pedido não pode mais ser validado.");
      }

      /**
       * ⏰ Regra das 48h
       */
      const hoursDiff = differenceInHours(new Date(), order.created_at);

      if (hoursDiff > 48) {
        await this.ordersRepository.updateStatusWithTx(
          tx,
          order.id,
          OrderStatus.EXPIRED,
        );
        throw new Error("Pedido expirado.");
      }

      /**
       * 🔎 2. Busca cashback vinculado ao pedido
       */
      const cashback = await this.cashbacksRepository.findByOrderIdWithTx(
        tx,
        order.id,
      );

      if (!cashback) {
        throw new Error("Cashback não encontrado para este pedido.");
      }

      /**
       * 🛑 Idempotência de cashback
       */
      if (cashback.status === "CONFIRMED") {
        throw new Error("Cashback já foi confirmado.");
      }

      /**
       * ✅ 3. Valida pedido
       */
      await this.ordersRepository.markAsValidatedWithTx(tx, order.id);

      /**
       * ✅ 4. Confirma cashback
       */
      await this.cashbacksRepository.confirmCashbackWithTx(tx, cashback.id);

      /**
       * 💰 5. Cria transação financeira
       */
      await this.cashbackTransactionsRepository.createWithTx(tx, {
        userId: cashback.user_id,
        storeId: cashback.store_id,
        amount: cashback.amount,
        type: "RECEIVE",
        orderId: order.id,
      });

      /**
       * 🚀 Retorno final
       */
      return {
        orderId: order.id,
        status: OrderStatus.VALIDATED,
        cashbackCredited: cashback.amount,
      };
    });
  }
}
