// src/use-cases/_factories/make-reactive-subscription-use-case.ts

import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { RenewSubscriptionUseCase } from "../subscriptions/renew-subscription";
import { prisma } from "@/lib/prisma";

export function makeRenewSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new RenewSubscriptionUseCase(subscriptionsRepository);
}
