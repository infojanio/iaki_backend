import { StoreReward } from "@prisma/client";

export interface StoreRewardsRepository {
  findById(rewardId: string): Promise<StoreReward | null>;
  decrementStock(rewardId: string): Promise<void>;
}
