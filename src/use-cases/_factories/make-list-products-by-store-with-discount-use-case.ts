import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { PrismaStoreDiscountRepository } from "@/repositories/prisma/prisma-store-discount-repository";
import { ListProductsByStoreWithDiscountUseCase } from "../products/list-products-by-store-with-discount";
import { prisma } from "@/lib/prisma";

export function makeListProductsByStoreWithDiscountUseCase() {
  const productsRepository = new PrismaProductsRepository(prisma);
  const storesRepository = new PrismaStoresRepository();
  const storeDiscountRepository = new PrismaStoreDiscountRepository();

  const useCase = new ListProductsByStoreWithDiscountUseCase(
    productsRepository,
    storesRepository,
    storeDiscountRepository,
  );

  return useCase;
}
