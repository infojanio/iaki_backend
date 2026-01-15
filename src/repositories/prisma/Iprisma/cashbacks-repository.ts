import { Cashback, CashbackTransaction, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CashbacksRepository {
  totalCashbackByUserId(user_id: string): Promise<number>;
  totalUsedCashbackByUserId(user_id: string): Promise<number>;
  findByUserId(user_id: string): Promise<Cashback[]>;
  findById(cashbackId: string): Promise<Cashback | null>;
  getBalance(user_id: string): Promise<number>;
  getTransactionsByUserId(userId: string): Promise<CashbackTransaction[]>;
  create(data: Prisma.CashbackUncheckedCreateInput): Promise<Cashback>;
  findByOrderId(orderId: string): Promise<Cashback | null>;
  confirmCashback(cashbackId: string): Promise<void>;

  redeemCashback(data: {
    user_id: string;
    order_id: string;
    amount: number;
  }): Promise<Cashback>;

  createTransaction(data: {
    user_id: string;
    amount: number | Decimal;
    type: "RECEIVE" | "USE";
  }): Promise<CashbackTransaction>;
}
