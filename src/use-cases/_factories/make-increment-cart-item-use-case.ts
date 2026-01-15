import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";

import { prisma } from "@/lib/prisma";
import { IncrementCartItemUseCase } from "../carts/increment-cart-item";

export function makeIncrementCartItemUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  return new IncrementCartItemUseCase(cartsRepository);
}
