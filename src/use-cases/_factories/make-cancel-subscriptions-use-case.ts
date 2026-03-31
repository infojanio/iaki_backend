import { prisma } from "@/lib/prisma";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { CancelSubscriptionUseCase } from "../subscriptions/cancel-subscription";

export function makeCancelSubscriptionsUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new CancelSubscriptionUseCase(subscriptionsRepository);
}
