import { Prisma, StoreRewardRedemption } from "@prisma/client";

import { prisma } from "@/lib/prisma";

import {
  StoreRewardRedemptionDetails,
  StoreRewardRedemptionsRepository,
} from "./Iprisma/store-reward-redemptions-repository";

export class PrismaStoreRewardRedemptionsRepository
  implements StoreRewardRedemptionsRepository
{
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

  async findPendingByUser(
    userId: string,
    storeId: string,
  ): Promise<StoreRewardRedemption[]> {
    return prisma.storeRewardRedemption.findMany({
      where: {
        userId,
        storeId,
        status: "PENDING",
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async confirmPendingById(
    redemptionId: string,
    storeId: string,
  ): Promise<StoreRewardRedemption | null> {
    const updated = await prisma.storeRewardRedemption.updateMany({
      where: {
        id: redemptionId,
        storeId,
        status: "PENDING",
      },

      data: {
        status: "CONFIRMED",
        usedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      return null;
    }

    return prisma.storeRewardRedemption.findUnique({
      where: {
        id: redemptionId,
      },
    });
  }

  async findPendingByStoreId(
    storeId: string,
  ): Promise<StoreRewardRedemptionDetails[]> {
    return prisma.storeRewardRedemption.findMany({
      where: {
        storeId,
        status: "PENDING",
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

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findConfirmedByStoreId(
    storeId: string,
  ): Promise<StoreRewardRedemptionDetails[]> {
    return prisma.storeRewardRedemption.findMany({
      where: {
        storeId,
        status: "CONFIRMED",
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

      orderBy: {
        usedAt: "desc",
      },
    });
  }

  async create(
    data: Prisma.StoreRewardRedemptionUncheckedCreateInput,
  ): Promise<StoreRewardRedemption> {
    return prisma.storeRewardRedemption.create({
      data,
    });
  }
}
