import { PrismaStoreRewardRedemptionsRepository } from "@/repositories/prisma/prisma-store-reward-redemptions-repository";
import { ListPendingRedemptionsUseCase } from "../store-reward/list-pending-redemptions-use-case";

export function makeListPendingRedemptionsUseCase() {
  const repository = new PrismaStoreRewardRedemptionsRepository();
  return new ListPendingRedemptionsUseCase(repository);
}
