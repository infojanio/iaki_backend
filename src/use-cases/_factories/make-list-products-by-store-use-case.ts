import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListProductsByStoreUseCase } from "../products/list-products-by-store";

export function makeListProductsByStoreUseCase() {
  const productsRepository = new PrismaProductsRepository();
  const storesRepository = new PrismaStoresRepository();

  const useCase = new ListProductsByStoreUseCase(
    productsRepository,
    storesRepository,
  );

  return useCase;
}
