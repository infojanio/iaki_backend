import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import {
  SubscriptionsRepository,
  SubscriptionUsageCounts,
} from "./Iprisma/subscriptions-repository";

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.subscription.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
    });
  }

  async findActiveByStoreId(storeId: string, referenceDate = new Date()) {
    return this.prisma.subscription.findFirst({
      where: {
        storeId,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
        endDate: {
          gte: referenceDate,
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findLatestByStoreId(storeId: string) {
    return this.prisma.subscription.findFirst({
      where: { storeId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findCurrentByStoreId(storeId: string) {
    const active = await this.findActiveByStoreId(storeId);
    if (active) return active;

    return this.findLatestByStoreId(storeId);
  }

  async cancelOpenSubscriptionsByStoreId(storeId: string) {
    await this.prisma.subscription.updateMany({
      where: {
        storeId,
        status: {
          in: ["ACTIVE", "TRIALING"],
        },
      },
      data: {
        status: "CANCELED",
      },
    });
  }

  async reactiveOpenSubscriptionsByStoreId(storeId: string) {
    const latest = await this.prisma.subscription.findFirst({
      where: { storeId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return;

    if (latest.status !== "CANCELED" && latest.status !== "EXPIRED") {
      return;
    }

    const now = new Date();

    const endDate = new Date(
      now.getTime() + latest.plan.durationDays * 24 * 60 * 60 * 1000,
    );

    await this.prisma.subscription.update({
      where: { id: latest.id },
      data: {
        status: "ACTIVE",
        startDate: now,
        endDate,
      },
    });
  }

  async updateStatus(id: string, status: SubscriptionStatus) {
    return this.prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }

  async getUsageCountsByStoreId(
    storeId: string,
  ): Promise<SubscriptionUsageCounts> {
    const [products, banners, reels, categories] = await Promise.all([
      this.prisma.product.count({ where: { storeId } }),
      this.prisma.banner.count({ where: { storeId } }),
      this.prisma.reel.count({ where: { storeId } }),
      this.prisma.category.count({
        where: {
          stores: {
            some: {
              storeId,
            },
          },
        },
      }),
    ]);

    return {
      products,
      banners,
      reels,
      categories,
    };
  }

  async listAllWithPlanAndStore() {
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
}
