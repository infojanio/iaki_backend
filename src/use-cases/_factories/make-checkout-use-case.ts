import { prisma } from "@/lib/prisma";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { CheckoutUseCase } from "../carts/checkout";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";

export function makeCheckoutUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  const ordersRepository = new PrismaOrdersRepository(prisma);
  const storesRepository = new PrismaStoresRepository();

  const useCase = new CheckoutUseCase(cartsRepository, ordersRepository);

  return useCase;
}
