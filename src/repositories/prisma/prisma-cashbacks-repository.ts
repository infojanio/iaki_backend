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
        userId: userId,
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
        userId: userId,
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
      where: { userId: userId },
      orderBy: { creditedAt: "desc" },
    });
  }

  async findById(cashbackId: string): Promise<Cashback | null> {
    return prisma.cashback.findUnique({
      where: { id: cashbackId },
    });
  }

  async findByOrderId(orderId: string): Promise<Cashback | null> {
    return prisma.cashback.findFirst({
      where: { orderId: orderId },
    });
  }

  async findByOrderIdWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<Cashback | null> {
    return tx.cashback.findFirst({
      where: { orderId: orderId },
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
        creditedAt: new Date(),
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
        creditedAt: new Date(),
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
        userId: data.userId,
        storeId: data.storeId,
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
        userId: data.userId,
        storeId: data.storeId,
        orderId: data.orderId,
        amount: finalAmount,
        type: data.type,
      },
    });
  }

  async createConfirmedCashbackWithTx(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      storeId: string;
      orderId: string;
      status: string;
      amount: Decimal | number;
    },
  ): Promise<Cashback> {
    return tx.cashback.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        orderId: data.orderId,
        amount: new Decimal(data.amount),
        status: CashbackStatus.CONFIRMED,
        validated: true,
        creditedAt: new Date(),
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
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  // =====================================================
  // SALDO (calculado pelas transações)
  // =====================================================
  async getBalance(userId: string): Promise<number> {
    const result = await prisma.cashbackTransaction.aggregate({
      _sum: { amount: true },
      where: { userId: userId },
    });

    return (result._sum.amount ?? new Decimal(0)).toNumber();
  }

  //saldo gerado para a loja
  async getBalanceByStore(userId: string, storeId: string): Promise<number> {
    const received = await prisma.cashback.aggregate({
      where: {
        userId: userId,
        storeId: storeId,
        status: "CONFIRMED",
      },
      _sum: {
        amount: true,
      },
    });

    const used = await prisma.cashbackTransaction.aggregate({
      where: {
        userId: userId,
        storeId: storeId,
        type: "USE",
      },
      _sum: {
        amount: true,
      },
    });

    return (
      Number(received._sum.amount ?? 0) -
      Math.abs(Number(used._sum.amount ?? 0))
    );
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
          userId: data.userId,
          orderId: data.orderId,
          storeId: data.storeId,
          amount: data.amount.abs().negated(),
          validated: true,
          status: CashbackStatus.CONFIRMED,
          creditedAt: new Date(),
        },
      });

      await tx.cashbackTransaction.create({
        data: {
          userId: data.userId,
          orderId: data.orderId,
          storeId: data.storeId,
          amount: data.amount.abs().negated(),
          type: "USE",
        },
      });

      return cashback;
    });
  }
}
