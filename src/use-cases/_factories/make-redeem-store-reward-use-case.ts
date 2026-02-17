import { PrismaStorePointsTransactionRepository } from "@/repositories/prisma/prisma-store-points-transaction-repository";
import { PrismaStorePointsWalletRepository } from "@/repositories/prisma/prisma-store-points-wallet-repository";
import { PrismaStoreRewardsRepository } from "@/repositories/prisma/prisma-store-rewards-repository";
import { RedeemStoreRewardUseCase } from "../store-points/redeem-store-reward-use-case";

export function makeRedeemStoreRewardUseCase() {
  const rewardsRepository = new PrismaStoreRewardsRepository();
  const walletRepository = new PrismaStorePointsWalletRepository();
  const transactionRepository = new PrismaStorePointsTransactionRepository();

  return new RedeemStoreRewardUseCase(
    rewardsRepository,
    walletRepository,
    transactionRepository,
  );
}
