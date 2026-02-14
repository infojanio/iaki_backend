import { prisma } from "@/lib/prisma";
import { StorePointsWalletRepository } from "./Iprisma/store-points-wallet-repository";

export class PrismaStorePointsWalletRepository
  implements StorePointsWalletRepository
{
  async findByUserAndStore(userId: string, storeId: string) {
    return prisma.storePointsWallet.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });
  }

  async decrementBalance(userId: string, storeId: string, points: number) {
    await prisma.storePointsWallet.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        balance: { decrement: points },
      },
    });
  }

  async incrementSpent(userId: string, storeId: string, points: number) {
    await prisma.storePointsWallet.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        spent: { increment: points },
      },
    });
  }
}
