import { StoreReward, Prisma } from "@prisma/client";
export interface RewardsRepository {
  findManyAvailableByCity(cityId: string): Promise<StoreReward[]>;
}
