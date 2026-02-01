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
  // =====================================================
  // TOTAIS
  // =====================================================
  async totalCashbackByUserId(userId: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: {
        user_id: userId,
        amount: { gt: 0 },
        status: CashbackStatus.CONFIRMED,
      },
    });

    return (result._sum.amount ?? new Decimal(0)).toNumber();
  }

  async totalUsedCashbackByUserId(userId: string): Promise<number> {
    const result = await prisma.cashback.aggregate({
      _sum: { amount: true },
      where: {
        user_id: userId,
        amount: { lt: 0 },
        status: CashbackStatus.CONFIRMED,
      },
    });

    return Math.abs((result._sum.amount ?? new Decimal(0)).toNumber());
  }

  // =====================================================
  // CONSULTAS
  // =====================================================
  async findByUserId(userId: string): Promise<Cashback[]> {
    return prisma.cashback.findMany({
      where: { user_id: userId },
      orderBy: { credited_at: "desc" },
    });
  }

  async findById(cashbackId: string): Promise<Cashback | null> {
    return prisma.cashback.findUnique({
      where: { id: cashbackId },
    });
  }

  async findByOrderId(orderId: string): Promise<Cashback | null> {
    return prisma.cashback.findFirst({
      where: { order_id: orderId },
    });
  }

  async findByOrderIdWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<Cashback | null> {
    return tx.cashback.findFirst({
      where: { order_id: orderId },
    });
  }

  // =====================================================
  // CREATE (pedido criado → cashback PENDING)
  // =====================================================
  async create(data: Prisma.CashbackUncheckedCreateInput): Promise<Cashback> {
    return prisma.cashback.create({ data });
  }

  // =====================================================
  // CONFIRMAR CASHBACK
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

  async confirmCashbackWithTx(
    tx: Prisma.TransactionClient,
    cashbackId: string,
  ): Promise<void> {
    await tx.cashback.update({
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
  async createTransaction(data: {
    userId: string;
    storeId: string;
    orderId?: string;
    amount: Decimal;
    type: "RECEIVE" | "USE";
  }): Promise<CashbackTransaction> {
    const finalAmount =
      data.type === "USE" ? data.amount.abs().negated() : data.amount.abs();

    return prisma.cashbackTransaction.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        orderId: data.orderId,
        amount: finalAmount,
        type: data.type,
      },
    });
  }

  async createTransactionWithTx(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      storeId: string;
      orderId?: string;
      amount: Decimal;
      type: "RECEIVE" | "USE";
    },
  ): Promise<CashbackTransaction> {
    const finalAmount =
      data.type === "USE" ? data.amount.abs().negated() : data.amount.abs();

    return tx.cashbackTransaction.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        orderId: data.orderId,
        amount: finalAmount,
        type: data.type,
      },
    });
  }

  // =====================================================
  // HISTÓRICO
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
  // SALDO (calculado pelas transações)
  // =====================================================
  async getBalance(userId: string): Promise<number> {
    const result = await prisma.cashbackTransaction.aggregate({
      _sum: { amount: true },
      where: { user_id: userId },
    });

    return (result._sum.amount ?? new Decimal(0)).toNumber();
  }

  // =====================================================
  // RESGATE
  // =====================================================
  async redeemCashback(data: {
    userId: string;
    orderId: string;
    storeId: string;
    amount: Decimal;
  }): Promise<Cashback> {
    const balance = await this.getBalance(data.userId);

    if (balance < data.amount.toNumber()) {
      throw new Error("Saldo de cashback insuficiente.");
    }

    return prisma.$transaction(async (tx) => {
      const cashback = await tx.cashback.create({
        data: {
          user_id: data.userId,
          order_id: data.orderId,
          store_id: data.storeId,
          amount: data.amount.abs().negated(),
          validated: true,
          status: CashbackStatus.CONFIRMED,
          credited_at: new Date(),
        },
      });

      await tx.cashbackTransaction.create({
        data: {
          user_id: data.userId,
          orderId: data.orderId,
          store_id: data.storeId,
          amount: data.amount.abs().negated(),
          type: "USE",
        },
      });

      return cashback;
    });
  }
}
