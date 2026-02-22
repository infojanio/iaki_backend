import { Prisma, StoreReward } from "@prisma/client";

export interface StoreRewardsRepository {
  findById(rewardId: string): Promise<StoreReward | null>;
  findActiveByStore(storeId: string): Promise<StoreReward[]>;
  decrementStock(rewardId: string): Promise<void>;
  create(data: Prisma.StoreRewardUncheckedCreateInput): Promise<StoreReward>;
  findByStoreId(storeId: string): Promise<StoreReward[]>;
  findById(id: string): Promise<StoreReward | null>;
  update(
    id: string,
    data: Prisma.StoreRewardUncheckedUpdateInput,
  ): Promise<StoreReward>;
}
