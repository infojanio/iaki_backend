import { prisma } from "@/lib/prisma";

import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { CreateStoreSubscriptionUseCase } from "../subscriptions/create-store-subscription";

export function makeCreateStoreSubscriptionUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const plansRepository = new PrismaPlansRepository();
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new CreateStoreSubscriptionUseCase(
    storesRepository,
    plansRepository,
    subscriptionsRepository,
  );
}
