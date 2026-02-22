import { prisma } from "@/lib/prisma";
import { Prisma, StoreReward } from "@prisma/client";
import { StoreRewardsRepository } from "./Iprisma/store-rewards-repository";

export class PrismaStoreRewardsRepository implements StoreRewardsRepository {
  async findById(rewardId: string): Promise<StoreReward | null> {
    return prisma.storeReward.findUnique({
      where: { id: rewardId },
    });
  }

  async findActiveByStore(storeId: string): Promise<StoreReward[]> {
    return prisma.storeReward.findMany({
      where: {
        storeId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ✅ Método exigido pela interface
  async decrementStock(rewardId: string): Promise<void> {
    const result = await prisma.storeReward.updateMany({
      where: {
        id: rewardId,
        stock: { gt: 0 },
      },
      data: {
        stock: { decrement: 1 },
      },
    });

    if (result.count === 0) {
      throw new Error("Sem estoque disponível.");
    }
  }

  // 🔒 Versão segura para uso dentro de transaction
  async decrementStockWithTx(
    tx: Prisma.TransactionClient,
    rewardId: string,
  ): Promise<void> {
    const result = await tx.storeReward.updateMany({
      where: {
        id: rewardId,
        stock: { gt: 0 },
      },
      data: {
        stock: { decrement: 1 },
      },
    });

    if (result.count === 0) {
      throw new Error("Sem estoque disponível.");
    }
  }

  async create(data: Prisma.StoreRewardUncheckedCreateInput) {
    return prisma.storeReward.create({ data });
  }

  async findByStoreId(storeId: string) {
    return prisma.storeReward.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: Prisma.StoreRewardUncheckedUpdateInput) {
    return prisma.storeReward.update({
      where: { id },
      data,
    });
  }
}
