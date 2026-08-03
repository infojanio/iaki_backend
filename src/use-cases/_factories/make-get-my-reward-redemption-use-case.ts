import { PrismaStoreRewardRedemptionsRepository } from "@/repositories/prisma/prisma-store-reward-redemptions-repository";
import { GetMyRewardRedemptionUseCase } from "../store-reward-redemptions/get-my-reward-redemption-use-case";

export function makeGetMyRewardRedemptionUseCase() {
  const storeRewardRedemptionsRepository =
    new PrismaStoreRewardRedemptionsRepository();

  return new GetMyRewardRedemptionUseCase(storeRewardRedemptionsRepository);
}
