import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { CreateStoreCategoryUseCase } from "../store-category/create-store-category";

import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";

export function makeCreateStoreCategoryUseCase() {
  const storeCategoryRepository = new PrismaStoreCategoryRepository();

  const storesRepository = new PrismaStoresRepository();
  const categoriesRepository = new PrismaCategoriesRepository();

  const useCase = new CreateStoreCategoryUseCase(
    storeCategoryRepository,
    storesRepository,
    categoriesRepository,
  );

  return useCase;
}
