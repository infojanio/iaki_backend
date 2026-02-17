import { PrismaStorePointsWalletRepository } from "@/repositories/prisma/prisma-store-points-wallet-repository";
import { GetUserStoresWithPointsUseCase } from "../users/get-user-stores-points-use-case";

export function makeGetUserStoresPointsUseCase() {
  const walletRepository = new PrismaStorePointsWalletRepository();

  return new GetUserStoresWithPointsUseCase(walletRepository);
}
