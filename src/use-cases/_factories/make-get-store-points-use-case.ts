import { PrismaStorePointsWalletRepository } from "@/repositories/prisma/prisma-store-points-wallet-repository";
import { GetStorePointsUseCase } from "../store-points/get-store-points-use-case";

export function makeGetStorePointsUseCase() {
  const walletRepository = new PrismaStorePointsWalletRepository();

  return new GetStorePointsUseCase(walletRepository);
}
