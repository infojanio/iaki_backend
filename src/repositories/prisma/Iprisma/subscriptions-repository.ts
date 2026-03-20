import { Subscription } from "@prisma/client";
import { SubscriptionWithPlan } from "../prisma-subscriptions-repository";

export interface SubscriptionsRepository {
  create(data: any): Promise<Subscription>;

  findActiveByStoreId(
    storeId: string,
    referenceDate?: Date,
  ): Promise<SubscriptionWithPlan | null>;

  findLatestByStoreId(storeId: string): Promise<SubscriptionWithPlan | null>;

  cancelOpenSubscriptionsByStoreId(storeId: string): Promise<void>;

  updateStatus(
    id: string,
    status: Subscription["status"],
  ): Promise<Subscription>;
}
