import {
  Cashback,
  CashbackStatus,
  CashbackTransaction,
  Prisma,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CashbacksRepository {
  // 🔹 Totais
  totalCashbackByUserId(userId: string): Promise<number>;
  totalUsedCashbackByUserId(userId: string): Promise<number>;

  // 🔹 Consultas
  findByUserId(userId: string): Promise<Cashback[]>;
  findById(cashbackId: string): Promise<Cashback | null>;

  findByOrderId(orderId: string): Promise<Cashback | null>;
  findByOrderIdWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<Cashback | null>;

  // 🔹 Saldo consolidado
  getBalance(userId: string): Promise<number>;

  getBalanceByStore(userId: string, storeId: string): Promise<number>;

  // 🔹 Histórico
  getTransactionsByUserId(userId: string): Promise<CashbackTransaction[]>;

  // 🔹 Criação
  create(data: Prisma.CashbackUncheckedCreateInput): Promise<Cashback>;

  // 🔹 Criação + confirmação direta (fluxo de validação)
  createConfirmedCashbackWithTx(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      storeId: string;
      orderId: string;
      status: string;
      amount: Decimal | number;
    },
  ): Promise<Cashback>;

  // 🔹 Confirmação (validação do pedido)
  confirmCashback(cashbackId: string): Promise<void>;

  // 🔹 Confirmação (TX – blindado)
  confirmCashbackWithTx(
    tx: Prisma.TransactionClient,
    cashbackId: string,
  ): Promise<void>;

  // 🔹 Resgate de cashback
  redeemCashback(data: {
    userId: string;
    orderId: string;
    storeId: string;
    amount: Decimal;
  }): Promise<Cashback>;

  // 🔹 Transações
  createTransaction(data: {
    userId: string;
    storeId: string;
    orderId?: string;
    amount: Decimal | number;
    type: "RECEIVE" | "USE";
  }): Promise<CashbackTransaction>;

  // 🔹 Transações (TX)
  createTransactionWithTx(
    tx: Prisma.TransactionClient,
    data: {
      userId: string;
      storeId: string;
      orderId?: string;
      amount: Decimal | number;
      type: "RECEIVE" | "USE";
    },
  ): Promise<CashbackTransaction>;
}
