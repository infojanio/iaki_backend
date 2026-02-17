import { StoreReward } from "@prisma/client";

export interface StoreRewardsRepository {
  findById(rewardId: string): Promise<StoreReward | null>;
  findActiveByStore(storeId: string): Promise<StoreReward[]>;
  decrementStock(rewardId: string): Promise<void>;
}
