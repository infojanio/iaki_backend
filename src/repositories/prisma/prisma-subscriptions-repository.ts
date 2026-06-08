import { PrismaClient, SubscriptionStatus } from "@prisma/client";
import {
  SubscriptionsRepository,
  SubscriptionUsageCounts,
} from "./Iprisma/subscriptions-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaClient) {}

  async updateEndDate(subscriptionId: string, endDate: Date): Promise<void> {
    await this.prisma.subscription.update({
      where: {
        id: subscriptionId,
      },
      data: {
        endDate,
      },
    });
  }

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

  /*
  async findCurrentByStoreId(storeId: string) {
    const active = await this.findActiveByStoreId(storeId);
    if (active) return active;

    return this.findLatestByStoreId(storeId);
  }
*/
  async renewSubscription(subscriptionId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscription) {
      throw new ResourceNotFoundError();
    }

    const currentEndDate =
      subscription.endDate > new Date() ? subscription.endDate : new Date();

    const newEndDate = new Date(currentEndDate);

    newEndDate.setDate(newEndDate.getDate() + 30);

    await this.prisma.subscription.update({
      where: {
        id: subscriptionId,
      },

      data: {
        endDate: newEndDate,
        status: "ACTIVE",
      },
    });
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await this.prisma.subscription.update({
      where: {
        id: subscriptionId,
      },

      data: {
        status: "CANCELED",
      },
    });
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

  // async reactiveOpenSubscriptionsByStoreId(storeId: string) { só foi renomeado para reactivateSubscription

  async reactivateSubscription(storeId: string) {
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
