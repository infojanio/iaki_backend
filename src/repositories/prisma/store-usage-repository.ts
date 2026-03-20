import { prisma } from "@/lib/prisma";
import { StoreUsageRepository } from "./Iprisma/store-usage-repository";

export class PrismaStoreUsageRepository implements StoreUsageRepository {
  async countProductsByStoreId(storeId: string): Promise<number> {
    return prisma.product.count({
      where: { storeId },
    });
  }

  async countBannersByStoreId(storeId: string): Promise<number> {
    return prisma.banner.count({
      where: { storeId },
    });
  }

  async countReelsByStoreId(storeId: string): Promise<number> {
    return prisma.reel.count({
      where: { storeId },
    });
  }

  async countCategoriesByStoreId(storeId: string): Promise<number> {
    return prisma.storeCategory.count({
      where: { storeId },
    });
  }
}
