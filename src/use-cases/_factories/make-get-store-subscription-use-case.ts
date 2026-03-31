import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { PrismaStoreUsageRepository } from "@/repositories/prisma/store-usage-repository";
import { GetStoreSubscriptionUseCase } from "../subscriptions/get-store-subscription";
import { prisma } from "@/lib/prisma";

export function makeGetStoreSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);
  const storeUsageRepository = new PrismaStoreUsageRepository();

  return new GetStoreSubscriptionUseCase(
    subscriptionsRepository,
    storeUsageRepository,
  );
}
