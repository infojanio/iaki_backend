// src/repositories/prisma/prisma-store-reward-redemptions-repository.ts
import { Prisma, RedemptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StoreRewardRedemptionsRepository } from "./Iprisma/store-reward-redemptions-repository";

export class PrismaStoreRewardRedemptionsRepository
  implements StoreRewardRedemptionsRepository
{
  async create(
    data: Prisma.StoreRewardRedemptionUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? prisma;
    return client.storeRewardRedemption.create({ data });
  }

  async findById(id: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return client.storeRewardRedemption.findUnique({ where: { id } });
  }

  async findPendingByUser(params: { userId: string; storeId: string }) {
    const { userId, storeId } = params;

    return prisma.storeRewardRedemption.findMany({
      where: {
        userId,
        storeId,
        status: "PENDING",
      },
      include: {
        reward: {
          select: {
            id: true,
            title: true,
            pointsCost: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async confirmPendingById(params: {
    redemptionId: string;
    storeId: string;
    usedAt: Date;
    tx?: Prisma.TransactionClient;
  }) {
    const client = params.tx ?? prisma;

    const result = await client.storeRewardRedemption.updateMany({
      where: {
        id: params.redemptionId,
        storeId: params.storeId,
        status: RedemptionStatus.PENDING,
      },
      data: {
        status: RedemptionStatus.CONFIRMED,
        usedAt: params.usedAt,
      },
    });

    return { updatedCount: result.count };
  }
}
