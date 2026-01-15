import { prisma } from "@/lib/prisma";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { RemoveItemFromCartUseCase } from "../carts/remove-itemFromCart";

export function makeRemoveItemFromCartUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);

  return new RemoveItemFromCartUseCase(cartsRepository);
}
