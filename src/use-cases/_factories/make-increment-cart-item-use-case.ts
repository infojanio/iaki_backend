import { PrismaClient } from "@prisma/client";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { IncrementCartItemUseCase } from "@/use-cases/carts/increment-cart-item";

export function makeIncrementCartItemUseCase() {
  const prisma = new PrismaClient();

  const cartsRepository = new PrismaCartsRepository(prisma);
  const productsRepository = new PrismaProductsRepository();

  return new IncrementCartItemUseCase(cartsRepository, productsRepository);
}
