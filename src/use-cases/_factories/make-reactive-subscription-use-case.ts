// src/use-cases/_factories/make-reactive-subscription-use-case.ts

import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { ReactiveSubscriptionUseCase } from "../subscriptions/reactive-subscription";
import { prisma } from "@/lib/prisma";

export function makeReactiveSubscriptionUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new ReactiveSubscriptionUseCase(subscriptionsRepository);
}
