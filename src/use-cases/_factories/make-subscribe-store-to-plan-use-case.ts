import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { SubscribeStoreToPlanUseCase } from "../subscriptions/subscribe-store-to-plan";
import { prisma } from "@/lib/prisma";

export function makeSubscribeStoreToPlanUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);
  const plansRepository = new PrismaPlansRepository();

  return new SubscribeStoreToPlanUseCase(
    subscriptionsRepository,
    plansRepository,
  );
}
