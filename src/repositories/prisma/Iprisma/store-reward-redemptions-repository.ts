// src/repositories/store-reward-redemptions-repository.ts
import {
  Prisma,
  RedemptionStatus,
  StoreRewardRedemption,
} from "@prisma/client";

export type ConfirmRedemptionResult = {
  updatedCount: number;
};

export interface StoreRewardRedemptionsRepository {
  create(
    data: Prisma.StoreRewardRedemptionUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<StoreRewardRedemption>;

  findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<StoreRewardRedemption | null>;

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

  cancelPendingById?(params: {
    redemptionId: string;
    storeId: string;
    tx?: Prisma.TransactionClient;
  }): Promise<{ updatedCount: number }>;
}
