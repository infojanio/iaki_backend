import { prisma } from "@/lib/prisma";
import { CashbackTransactionsRepository } from "./Iprisma/cashback-transations-repository";

export class PrismaCashbackTransactionsRepository
  implements CashbackTransactionsRepository
{
  async create(data: any) {
    await prisma.cashbackTransaction.create({
      data: {
        user_id: data.userId,
        store_id: data.storeId,
        amount: data.amount,
        type: data.type,
        orderId: data.orderId,
      },
    });
  }
}
