import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";

import { UpdateStoreRewardUseCase } from "../store-reward/update-store-reward-use-case";

export function makeUpdateStoreRewardUseCase() {
  const repository = new PrismaStoreRewardsRepository();

  return new UpdateStoreRewardUseCase(repository);
}
