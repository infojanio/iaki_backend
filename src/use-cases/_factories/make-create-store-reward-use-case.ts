import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";
import { CreateStoreRewardUseCase } from "../store-reward/create-store-reward-use-case";

export function makeCreateStoreRewardUseCase() {
  const repository = new PrismaStoreRewardsRepository();
  return new CreateStoreRewardUseCase(repository);
}
