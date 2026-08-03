// src/repositories/prisma/prisma-store-reward-redemptions-repository.ts
import { Prisma, RedemptionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  StoreRewardRedemptionDetails,
  StoreRewardRedemptionsRepository,
} from "./Iprisma/store-reward-redemptions-repository";

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

  async findRedemptionByIdAndUserId(
    redemptionId: string,
    userId: string,
  ): Promise<StoreRewardRedemptionDetails | null> {
    return prisma.storeRewardRedemption.findFirst({
      where: {
        id: redemptionId,
        userId,
      },

      include: {
        reward: {
          select: {
            id: true,
            title: true,
            description: true,
            image: true,
            pointsCost: true,
          },
        },

        store: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        user: {
          select: {
            id: true,
            name: true,
            cpf: true,
            phone: true,
          },
        },
      },
    });
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

  async findPendingByStoreId(storeId: string) {
    return prisma.storeRewardRedemption.findMany({
      where: {
        storeId,
        status: "PENDING",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },

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

  async findConfirmedByStoreId(storeId: string) {
    return prisma.storeRewardRedemption.findMany({
      where: {
        storeId,
        status: "CONFIRMED",
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },

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
        usedAt: "desc",
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
