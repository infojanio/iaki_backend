import { PrismaStoreRewardRedemptionsRepository } from "@/repositories/prisma/prisma-store-reward-redemptions-repository";
import { ListPendingStoreRewardRedemptionsUseCase } from "../store-reward-redemptions/list-pending-store-reward-redemptions-use-case.ts";

export function makeListPendingStoreRewardRedemptionsUseCase() {
  const repository = new PrismaStoreRewardRedemptionsRepository();

  return new ListPendingStoreRewardRedemptionsUseCase(repository);
}
