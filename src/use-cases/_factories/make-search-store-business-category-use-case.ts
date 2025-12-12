import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { SearchStoreBusinessCategoryUseCase } from "../store-business-category/search-store-business-category";

export function makeSearchStoreBusinessCategoryUseCase() {
  const storeBusinessCategoryRepository =
    new PrismaStoreBusinessCategoryRepository();

  const useCase = new SearchStoreBusinessCategoryUseCase(
    storeBusinessCategoryRepository,
  );

  return useCase;
}
