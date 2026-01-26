import { prisma } from "@/lib/prisma";
import { StoreEvaluation } from "@prisma/client";
import { StoreEvaluationsRepository } from "./Iprisma/store-evaluations-repository";

export class PrismaStoreEvaluationsRepository
  implements StoreEvaluationsRepository
{
  async findByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<StoreEvaluation | null> {
    return prisma.storeEvaluation.findFirst({
      where: {
        userId,
        storeId,
      },
    });
  }

  async create(data: {
    userId: string;
    storeId: string;
    rating: number;
  }): Promise<StoreEvaluation> {
    return prisma.storeEvaluation.create({
      data,
    });
  }
}
