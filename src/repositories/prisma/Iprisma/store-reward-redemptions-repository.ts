// src/repositories/store-reward-redemptions-repository.ts
import {
  Prisma,
  RedemptionStatus,
  StoreRewardRedemption,
} from "@prisma/client";

export type ConfirmRedemptionResult = {
  updatedCount: number;
};

export type StoreRewardRedemptionDetails =
  Prisma.StoreRewardRedemptionGetPayload<{
    include: {
      reward: {
        select: {
          id: true;
          title: true;
          description: true;
          image: true;
          pointsCost: true;
        };
      };

      store: {
        select: {
          id: true;
          name: true;
          avatar: true;
        };
      };

      user: {
        select: {
          id: true;
          name: true;
          cpf: true;
          phone: true;
        };
      };
    };
  }>;

export interface StoreRewardRedemptionsRepository {
  create(
    data: Prisma.StoreRewardRedemptionUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<StoreRewardRedemption>;

  findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<StoreRewardRedemption | null>;

  findRedemptionByIdAndUserId(
    redemptionId: string,
    userId: string,
  ): Promise<StoreRewardRedemptionDetails | null>;

  findPendingByUser(params: { userId: string; storeId: string }): Promise<
    (StoreRewardRedemption & {
      reward: {
        id: string;
        title: string;
        pointsCost: number;
        image: string | null;
      };
    })[]
  >;

  confirmPendingById(params: {
    redemptionId: string;
    storeId: string;
    usedAt: Date;
    tx?: Prisma.TransactionClient;
  }): Promise<ConfirmRedemptionResult>;

  findPendingByStoreId(storeId: string): Promise<any[]>;

  findConfirmedByStoreId(storeId: string): Promise<any[]>;

  confirmPendingById(params: {
    redemptionId: string;
    storeId: string;
    usedAt: Date;
    tx?: Prisma.TransactionClient;
  }): Promise<{
    updatedCount: number;
  }>;

  cancelPendingById?(params: {
    redemptionId: string;
    storeId: string;
    tx?: Prisma.TransactionClient;
  }): Promise<{ updatedCount: number }>;
}
