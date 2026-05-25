import { Prisma, StoreReward } from "@prisma/client";

export interface StoreRewardsRepository {
  create(data: Prisma.StoreRewardUncheckedCreateInput): Promise<StoreReward>;

  findById(rewardId: string): Promise<StoreReward | null>;

  findByStoreId(storeId: string): Promise<StoreReward[]>;

  findActiveByStore(storeId: string): Promise<StoreReward[]>;

  update(
    id: string,
    data: Prisma.StoreRewardUncheckedUpdateInput,
  ): Promise<StoreReward>;

  delete(id: string): Promise<void>;

  decrementStock(rewardId: string): Promise<void>;

  decrementStockWithTx(
    tx: Prisma.TransactionClient,
    rewardId: string,
  ): Promise<void>;
}
