import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";

import { GetStoreRewardUseCase } from "../store-reward/get-store-reward-use-case";

export function makeGetStoreRewardUseCase() {
  const repository = new PrismaStoreRewardsRepository();

  return new GetStoreRewardUseCase(repository);
}
