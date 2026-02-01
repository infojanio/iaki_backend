import { prisma } from "@/lib/prisma";
import { CashbackTransaction, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import {
  CashbackTransactionsRepository,
  CreateCashbackTransactionDTO,
} from "./Iprisma/cashback-transations-repository";

export class PrismaCashbackTransactionsRepository
  implements CashbackTransactionsRepository
{
  async create(
    data: CreateCashbackTransactionDTO,
  ): Promise<CashbackTransaction> {
    return prisma.cashbackTransaction.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        amount: new Decimal(data.amount),
        type: data.type,
        orderId: data.orderId ?? null,
      },
    });
  }

  async createWithTx(
    tx: Prisma.TransactionClient,
    data: CreateCashbackTransactionDTO,
  ): Promise<CashbackTransaction> {
    return tx.cashbackTransaction.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        orderId: data.orderId ?? null,
        amount: new Decimal(data.amount),
        type: data.type,
      },
    });
  }
}
