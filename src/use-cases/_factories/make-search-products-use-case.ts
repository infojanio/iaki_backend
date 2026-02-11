// src/use-cases/_factories/make-search-products-use-case.ts
import { prisma } from "@/lib/prisma";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { SearchProductsUseCase } from "@/use-cases/products/search-products";

export function makeSearchProductsUseCase() {
  const productsRepository = new PrismaProductsRepository(prisma);
  const useCase = new SearchProductsUseCase(productsRepository);
  return useCase;
}
