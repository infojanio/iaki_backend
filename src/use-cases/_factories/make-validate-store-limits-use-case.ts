import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { ValidateStoreLimitsUseCase } from "../subscriptions/validate-store-limits";
import { PrismaStoreUsageRepository } from "@/repositories/prisma/store-usage-repository";
import { prisma } from "@/lib/prisma";

export function makeValidateStoreLimitsUseCase() {
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);
  const storeUsageRepository = new PrismaStoreUsageRepository();

  return new ValidateStoreLimitsUseCase(
    subscriptionsRepository,
    storeUsageRepository,
  );
}
