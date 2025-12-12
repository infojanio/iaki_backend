import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { CreateStoreBusinessCategoryUseCase } from "../store-business-category/create-store-business-category";
import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";

export function makeCreateStoreBusinessCategoryUseCase() {
  const storeBusinessCategoryRepository =
    new PrismaStoreBusinessCategoryRepository();

  const storesRepository = new PrismaStoresRepository();
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new CreateStoreBusinessCategoryUseCase(
    storeBusinessCategoryRepository,
    storesRepository,
    businessCategoriesRepository,
  );

  return useCase;
}
