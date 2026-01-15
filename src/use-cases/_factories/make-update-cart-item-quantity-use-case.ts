import { prisma } from "@/lib/prisma";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { UpdateCartItemQuantityUseCase } from "@/use-cases/carts/update-cart-item-quantity";

export function makeUpdateCartItemQuantityUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  const useCase = new UpdateCartItemQuantityUseCase(cartsRepository);
  return useCase;
}
