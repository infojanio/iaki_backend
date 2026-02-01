import {
  CashbackTransaction,
  CashbackTransactionType,
  Prisma,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CreateCashbackTransactionDTO {
  userId: string;
  storeId: string;
  amount: Decimal;
  type: CashbackTransactionType;
  orderId?: string;
}

export interface CashbackTransactionsRepository {
  //normal
  create(data: CreateCashbackTransactionDTO): Promise<CashbackTransaction>;

  //transacional
  createWithTx(
    tx: Prisma.TransactionClient,
    data: CreateCashbackTransactionDTO,
  ): Promise<CashbackTransaction>;
}
