import { prisma } from "@/lib/prisma";
import { StoreRewardsRepository } from "./Iprisma/store-rewards-repository";

export class PrismaStoreRewardsRepository implements StoreRewardsRepository {
  async findById(rewardId: string) {
    return prisma.storeReward.findUnique({
      where: { id: rewardId },
    });
  }

  async decrementStock(rewardId: string) {
    await prisma.storeReward.update({
      where: { id: rewardId },
      data: {
        stock: { decrement: 1 },
      },
    });
  }
}
