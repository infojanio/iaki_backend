import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";

import { prisma } from "@/lib/prisma";
import { DecrementCartItemUseCase } from "../carts/decrement-cart-item";

export function makeDecrementCartItemUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  return new DecrementCartItemUseCase(cartsRepository);
}
