import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { GetStoreUsageUseCase } from "../products/get-store-usage";
import { prisma } from "@/lib/prisma";

export function makeGetStoreUsageUseCase() {
  const productsRepository = new PrismaProductsRepository(prisma);
  const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

  return new GetStoreUsageUseCase(productsRepository, subscriptionsRepository);
}
