import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { GetOpenCartUseCase } from "../carts/get-open-cart";
import { prisma } from "@/lib/prisma";

export function makeGetOpenCartUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  return new GetOpenCartUseCase(cartsRepository);
}
