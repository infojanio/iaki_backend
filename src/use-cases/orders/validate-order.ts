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
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    // 🔐 Loja dona do pedido
    if (order.store_id !== storeId) {
      throw new Error("Você não tem permissão para validar este pedido.");
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Este pedido não pode mais ser validado.");
    }

    // ⏰ Regra de 48h
    const hoursDiff = differenceInHours(new Date(), order.created_at);
    if (hoursDiff > 48) {
      await this.ordersRepository.updateStatus(order.id, OrderStatus.EXPIRED);
      throw new Error("Pedido expirado.");
    }

    // ✅ 1. Valida o pedido
    await this.ordersRepository.markAsValidated(order.id);

    // 🔎 Cashback do pedido
    const cashback = await this.cashbacksRepository.findByOrderId(order.id);

    if (!cashback) {
      throw new Error("Cashback não encontrado para este pedido.");
    }

    // ✅ 2. Confirma cashback
    await this.cashbacksRepository.confirmCashback(cashback.id);

    // ✅ 3. Cria transação de cashback
    await this.cashbackTransactionsRepository.create({
      userId: cashback.user_id,
      storeId: cashback.store_id,
      amount: cashback.amount,
      type: "RECEIVE",
      orderId: order.id,
    });

    // ✅ 4. Retorno consistente
    return {
      orderId: order.id,
      status: OrderStatus.VALIDATED,
      cashbackCredited: cashback.amount,
    };
  }
}
