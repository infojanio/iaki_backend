import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { GetCartSummaryByStoreUseCase } from "../carts/get-cart-summary-by-store";
import { prisma } from "@/lib/prisma";

export function makeGetCartSummaryByStoreUseCase() {
  const cartsRepository = new PrismaCartsRepository(prisma);
  return new GetCartSummaryByStoreUseCase(cartsRepository);
}
