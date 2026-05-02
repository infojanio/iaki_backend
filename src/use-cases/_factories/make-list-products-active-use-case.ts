import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { ListProductsActiveUseCase } from "../products/list-products-active";
import { prisma } from "@/lib/prisma";
export function makeListProductsActiveUseCase() {
  const productsRepository = new PrismaProductsRepository(prisma);
  const useCase = new ListProductsActiveUseCase(productsRepository);
  return useCase;
}
