import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";
import { GetStoreRewardsUseCase } from "../store-points/get-store-rewards-use-case";

export function makeGetStoreRewardsUseCase() {
  const rewardsRepository = new PrismaStoreRewardsRepository();
  return new GetStoreRewardsUseCase(rewardsRepository);
}
