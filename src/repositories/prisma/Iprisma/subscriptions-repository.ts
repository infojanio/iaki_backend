import {
  Subscription,
  SubscriptionStatus,
  Prisma,
  City,
  Plan,
  Store,
} from "@prisma/client";

export type SubscriptionWithPlan = Subscription & {
  plan: {
    id: string;
    name: string;
    price: Prisma.Decimal;
    durationDays: number;
    maxProducts: number | null;
    maxBanners: number | null;
    maxReels: number | null;
    maxCategories: number | null;
    isActive: boolean;
  };
};

export interface SubscriptionUsageCounts {
  products: number;
  banners: number;
  reels: number;
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

  // 🔹 CONSULTAS
  findActiveByStoreId(
    storeId: string,
    referenceDate?: Date,
  ): Promise<SubscriptionWithPlan | null>;

  findLatestByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  findCurrentByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  // 🔹 CONTROLE
  cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription>;

  // 🔹 USAGE (ESSENCIAL PRO SAAS)
  getUsageCountsByStoreId(storeId: string): Promise<SubscriptionUsageCounts>;

  listAllWithPlanAndStore(): Promise<SubscriptionWithPlanAndStore[]>;
}
