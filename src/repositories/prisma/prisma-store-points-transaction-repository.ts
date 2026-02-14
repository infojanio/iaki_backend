import { prisma } from "@/lib/prisma";
import { StorePointsTransactionRepository } from "./Iprisma/store-points-transaction-repository";

export class PrismaStorePointsTransactionRepository
  implements StorePointsTransactionRepository
{
  async create(data: {
    userId: string;
    storeId: string;
    type: "SPEND";
    points: number;
    note?: string;
  }) {
    await prisma.storePointsTransaction.create({
      data,
    });
  }
}
