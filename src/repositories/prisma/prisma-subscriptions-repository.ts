import { prisma } from "@/lib/prisma";
import { Prisma, Subscription, SubscriptionStatus, Plan } from "@prisma/client";
import { SubscriptionsRepository } from "./Iprisma/subscriptions-repository";

export type SubscriptionWithPlan = Subscription & {
  plan: Plan;
};

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  async create(
    data: Prisma.SubscriptionUncheckedCreateInput,
  ): Promise<Subscription> {
    return prisma.subscription.create({ data });
  }

  async findActiveByStoreId(
    storeId: string,
    referenceDate: Date = new Date(),
  ): Promise<SubscriptionWithPlan | null> {
    return prisma.subscription.findFirst({
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
        createdAt: "desc",
      },
    });
  }

  async findLatestByStoreId(
    storeId: string,
  ): Promise<SubscriptionWithPlan | null> {
    return prisma.subscription.findFirst({
      where: { storeId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void> {
    await prisma.subscription.updateMany({
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

  async updateStatus(
    id: string,
    status: Subscription["status"],
  ): Promise<Subscription> {
    return prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }
}
