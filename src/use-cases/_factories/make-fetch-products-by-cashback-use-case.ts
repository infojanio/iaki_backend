import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";

import { prisma } from "@/lib/prisma.js";
import { FetchProductsByCashbackUseCase } from "../products/fetch-products-by-cashback.ts";
export function makeFetchProductsByCashbackUseCase() {
  const productsRepository = new PrismaProductsRepository(prisma);
  const useCase = new FetchProductsByCashbackUseCase(productsRepository);
  return useCase;
}
