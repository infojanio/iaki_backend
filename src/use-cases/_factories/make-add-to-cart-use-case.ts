import { prisma } from "@/lib/prisma";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { AddToCartUseCase } from "../carts/add-to-cart";

export function makeAddToCartUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  const productsRepository = new PrismaProductsRepository();

  return new AddToCartUseCase(cartsRepository, productsRepository);
}
