import { PrismaStoreRewardRedemptionsRepository } from "@/repositories/prisma/prisma-store-reward-redemptions-repository";

import { ListConfirmedStoreRewardRedemptionsUseCase } from "../store-reward-redemptions/list-confirmed-store-reward-redemptions-use-case";

export function makeListConfirmedStoreRewardRedemptionsUseCase() {
  const repository = new PrismaStoreRewardRedemptionsRepository();

  return new ListConfirmedStoreRewardRedemptionsUseCase(repository);
}
