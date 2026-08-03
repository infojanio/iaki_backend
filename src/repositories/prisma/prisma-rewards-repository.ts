import { prisma } from "@/lib/prisma";
import { StoreReward } from "@prisma/client";

export class PrismaRewardsRepository {
  async findManyAvailableByCity(cityId: string): Promise<StoreReward[]> {
    return prisma.storeReward.findMany({
      where: {
        isActive: true,

        /*
         * Mantenha este filtro se o campo
         * de estoque se chama quantity.
         */
        stock: {
          gt: 0,
        },

        store: {
          cityId,
          isActive: true,
        },
      },

      include: {
        store: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
