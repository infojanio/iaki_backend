import { Prisma, StoreRewardRedemption } from "@prisma/client";

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
  findRedemptionByIdAndUserId(
    redemptionId: string,
    userId: string,
  ): Promise<StoreRewardRedemptionDetails | null>;

  findPendingByUser(
    userId: string,
    storeId: string,
  ): Promise<StoreRewardRedemption[]>;

  confirmPendingById(
    redemptionId: string,
    storeId: string,
  ): Promise<StoreRewardRedemption | null>;

  findPendingByStoreId(
    storeId: string,
  ): Promise<StoreRewardRedemptionDetails[]>;

  findConfirmedByStoreId(
    storeId: string,
  ): Promise<StoreRewardRedemptionDetails[]>;

  create(
    data: Prisma.StoreRewardRedemptionUncheckedCreateInput,
  ): Promise<StoreRewardRedemption>;
}
