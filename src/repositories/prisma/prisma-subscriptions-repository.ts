import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import {
  SubscriptionsRepository,
  SubscriptionWithPlan,
  SubscriptionUsageCounts,
  SubscriptionWithPlanAndStore,
} from "./Iprisma/subscriptions-repository";

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.subscription.create({ data });
  }

  async findActiveByStoreId(
    storeId: string,
    referenceDate = new Date(),
  ): Promise<SubscriptionWithPlan | null> {
    return this.prisma.subscription.findFirst({
      where: {
        storeId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
        startDate: {
          lte: referenceDate,
        },
        endDate: {
          gte: referenceDate,
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        endDate: "desc",
      },
    });
  }

  async findLatestByStoreId(
    storeId: string,
  ): Promise<SubscriptionWithPlan | null> {
    return this.prisma.subscription.findFirst({
      where: { storeId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findCurrentByStoreId(
    storeId: string,
  ): Promise<SubscriptionWithPlan | null> {
    const active = await this.findActiveByStoreId(storeId);

    if (active) return active;

    const latest = await this.findLatestByStoreId(storeId);

    // fallback → última subscription (mesmo que expirada)
    return latest ?? null;
  }

  async cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: {
        storeId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING],
        },
      },
      data: {
        status: SubscriptionStatus.CANCELED,
      },
    });
  }

  async updateStatus(id: string, status: SubscriptionStatus) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }

  async listAllWithPlanAndStore(): Promise<SubscriptionWithPlanAndStore[]> {
    return this.prisma.subscription.findMany({
      include: {
        plan: true,
        store: {
          include: {
            city: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getUsageCountsByStoreId(
    storeId: string,
  ): Promise<SubscriptionUsageCounts> {
    const [products, banners, reels] = await Promise.all([
      this.prisma.product.count({
        where: { storeId },
      }),
      this.prisma.banner.count({
        where: { storeId },
      }),
      this.prisma.reel.count({
        where: { storeId },
      }),
    ]);

    return {
      products,
      banners,
      reels,
    };
  }
}
