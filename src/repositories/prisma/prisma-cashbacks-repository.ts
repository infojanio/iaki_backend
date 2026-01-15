import { prisma } from "@/lib/prisma";
import { CashbacksRepository } from "./Iprisma/cashbacks-repository";
import {
  Cashback,
  CashbackStatus,
  CashbackTransaction,
  Prisma,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaCashbacksRepository implements CashbacksRepository {
  async totalCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: {
        user_id,
        amount: { gt: 0 },
        status: CashbackStatus.CONFIRMED,
      },
    });

    return (result._sum.amount ?? new Decimal(0)).toNumber();
  }

  async totalUsedCashbackByUserId(user_id: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: {
        user_id,
        amount: { lt: 0 },
        status: CashbackStatus.CONFIRMED,
      },
    });

    return Math.abs((result._sum.amount ?? new Decimal(0)).toNumber());
  }

  async findByUserId(user_id: string): Promise<Cashback[]> {
    return prisma.cashback.findMany({
      where: { user_id },
      orderBy: { credited_at: "desc" },
    });
  }

  async findById(cashbackId: string): Promise<Cashback | null> {
    return prisma.cashback.findUnique({
      where: { id: cashbackId },
    });
  }

  // =====================================================
  // CREATE — usado no CreateOrderUseCase (PENDING)
  // =====================================================
  async create(data: Prisma.CashbackUncheckedCreateInput): Promise<Cashback> {
    return prisma.cashback.create({
      data,
    });
  }

  // =====================================================
  // TRANSAÇÕES (extrato)
  // =====================================================
  async createTransaction(data: {
    user_id: string;
    store_id: string;
    amount: Decimal | number;
    type: "RECEIVE" | "USE";
    order_id?: string;
  }): Promise<CashbackTransaction> {
    const value = new Decimal(data.amount);

    const finalAmount =
      data.type === "USE" ? value.abs().negated() : value.abs();

    return prisma.cashbackTransaction.create({
      data: {
        user_id: data.user_id,
        store_id: data.store_id,
        orderId: data.order_id,
        amount: finalAmount,
        type: data.type,
      },
    });
  }

  // =====================================================
  // FIND BY ORDER — usado no ValidateOrderUseCase
  // =====================================================
  async findByOrderId(orderId: string): Promise<Cashback | null> {
    return prisma.cashback.findFirst({
      where: { order_id: orderId },
    });
  }

  // =====================================================
  // CONFIRM CASHBACK — chamado APÓS validar pedido
  // =====================================================
  async confirmCashback(cashbackId: string): Promise<void> {
    await prisma.cashback.update({
      where: { id: cashbackId },
      data: {
        status: CashbackStatus.CONFIRMED,
        validated: true,
        credited_at: new Date(),
      },
    });
  }

  // =====================================================
  // TRANSAÇÕES (extrato)
  // =====================================================
  async getTransactionsByUserId(
    userId: string,
  ): Promise<CashbackTransaction[]> {
    return prisma.cashbackTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
  }

  // =====================================================
  // SALDO (calculado a partir das transações)
  // =====================================================
  async getBalance(user_id: string): Promise<number> {
    const transactions = await prisma.cashbackTransaction.findMany({
      where: { user_id },
      select: { amount: true },
    });

    return transactions.reduce((acc, tx) => {
      return acc + new Decimal(tx.amount).toNumber();
    }, 0);
  }

  async redeemCashback({
    user_id,
    order_id,
    store_id,
    amount,
  }: {
    user_id: string;
    order_id: string;
    store_id: string;
    amount: number;
  }) {
    const usedAmount = -Math.abs(amount);

    const currentBalance = await this.getBalance(user_id);
    if (currentBalance < Math.abs(usedAmount)) {
      throw new Error("Saldo de cashback insuficiente.");
    }

    const cashback = await prisma.cashback.create({
      data: {
        user_id,
        order_id,
        store_id,
        amount: new Decimal(usedAmount),
        validated: true,
        status: CashbackStatus.CONFIRMED,
        credited_at: new Date(),
      },
    });

    await prisma.cashbackTransaction.create({
      data: {
        user_id,
        store_id,
        amount: new Decimal(usedAmount),
        type: "USE",
      },
    });

    return cashback;
  }
}
