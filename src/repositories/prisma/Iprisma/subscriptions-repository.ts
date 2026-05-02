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

  update(
    id: string,
    data: Prisma.SubscriptionUncheckedUpdateInput,
  ): Promise<Subscription>;

  findById(id: string): Promise<Subscription | null>;

  // 🔹 CONSULTAS
  findActiveByStoreId(
    storeId: string,
    referenceDate?: Date,
  ): Promise<SubscriptionWithPlan | null>;

  findLatestByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  findCurrentByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  // 🔹 CONTROLE
  cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  reactiveOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription>;

  // 🔹 USAGE (ESSENCIAL PRO SAAS)
  getUsageCountsByStoreId(storeId: string): Promise<SubscriptionUsageCounts>;

  // 🔹 ADMIN
  listAllWithPlanAndStore(): Promise<SubscriptionWithPlanAndStore[]>;
}
