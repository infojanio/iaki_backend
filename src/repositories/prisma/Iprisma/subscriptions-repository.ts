import {
  Subscription,
  SubscriptionStatus,
  Prisma,
  City,
  Plan,
  Store,
} from "@prisma/client";

export type SubscriptionWithPlan = Subscription & {
  plan: Plan;
};

export interface SubscriptionUsageCounts {
  products: number;
  banners: number;
  reels: number;
  categories: number;
}

export type SubscriptionWithPlanAndStore = Subscription & {
  plan: Plan;
  store: Store & {
    city: City | null;
  };
};

export interface SubscriptionsRepository {
  // 🔹 CORE
  create(data: Prisma.SubscriptionUncheckedCreateInput): Promise<Subscription>;

  createReplacingOpenSubscriptions(data: {
    storeId: string;
    planId: string;
    status: SubscriptionStatus;
    startDate: Date;
    endDate: Date;
  }): Promise<Subscription>;

  update(
    id: string,
    data: Prisma.SubscriptionUncheckedUpdateInput,
  ): Promise<Subscription>;

  findById(id: string): Promise<Subscription | null>;

  // 🔹 CONSULTAS
  // findCurrentByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;
  findActiveByStoreId(
    storeId: string,
    referenceDate?: Date,
  ): Promise<SubscriptionWithPlan | null>;

  findLatestByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  // 🔹 CONTROLE
  cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  //reactiveOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription>;

  // 🔹 USAGE (ESSENCIAL PRO SAAS)
  getUsageCountsByStoreId(storeId: string): Promise<SubscriptionUsageCounts>;

  // 🔹 ADMIN
  listAllWithPlanAndStore(): Promise<SubscriptionWithPlanAndStore[]>;

  renewSubscription(subscriptionId: string): Promise<void>;

  reactivateSubscription(storeId: string): Promise<void>;

  cancelSubscription(subscriptionId: string): Promise<void>;

  updateEndDate(subscriptionId: string, endDate: Date): Promise<void>;
}
