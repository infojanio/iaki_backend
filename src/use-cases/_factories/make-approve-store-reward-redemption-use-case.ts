import { PrismaStoreRewardRedemptionsRepository } from "@/repositories/prisma/prisma-store-reward-redemptions-repository";

import { ApproveStoreRewardRedemptionUseCase } from "../store-reward-redemptions/approve-store-reward-redemption-use-case";

export function makeApproveStoreRewardRedemptionUseCase() {
  const repository = new PrismaStoreRewardRedemptionsRepository();

  return new ApproveStoreRewardRedemptionUseCase(repository);
}
