import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { PrismaStoreUsageRepository } from "@/repositories/prisma/store-usage-repository";
import { GetStoreSubscriptionUseCase } from "../subscriptions/get-store-subscription";

export function makeGetStoreSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository();
  const storeUsageRepository = new PrismaStoreUsageRepository();

  return new GetStoreSubscriptionUseCase(
    subscriptionsRepository,
    storeUsageRepository,
  );
}
