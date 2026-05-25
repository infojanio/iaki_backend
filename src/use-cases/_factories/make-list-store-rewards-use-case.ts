import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";
import { ListStoreRewardsUseCase } from "../store-reward/list-store-rewards-use-case";

export function makeListStoreRewardsUseCase() {
  const repository = new PrismaStoreRewardsRepository();

  return new ListStoreRewardsUseCase(repository);
}
