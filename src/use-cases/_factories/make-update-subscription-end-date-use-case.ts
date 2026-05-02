import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { prisma } from "@/lib/prisma";
import { UpdateSubscriptionEndDateUseCase } from "../subscriptions/update-subscription-end-date";

export function makeUpdateSubscriptionEndDateUseCase() {
  const repo = new PrismaSubscriptionsRepository(prisma);

  return new UpdateSubscriptionEndDateUseCase(repo);
}
