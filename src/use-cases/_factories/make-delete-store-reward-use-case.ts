import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";

import { DeleteStoreRewardUseCase } from "../store-reward/delete-store-reward-use-case";

export function makeDeleteStoreRewardUseCase() {
  const repository = new PrismaStoreRewardsRepository();

  return new DeleteStoreRewardUseCase(repository);
}
