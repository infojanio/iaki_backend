import { prisma } from "@/lib/prisma";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { CheckoutUseCase } from "../carts/checkout";

export function makeCheckoutUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  const ordersRepository = new PrismaOrdersRepository(prisma);

  return new CheckoutUseCase(cartsRepository, ordersRepository);
}
