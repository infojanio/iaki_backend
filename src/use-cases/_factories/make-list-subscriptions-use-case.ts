import { prisma } from "@/lib/prisma";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { ListSubscriptionsUseCase } from "../subscriptions/list-subscriptions";

export function makeListSubscriptionsUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new ListSubscriptionsUseCase(subscriptionsRepository);
}
