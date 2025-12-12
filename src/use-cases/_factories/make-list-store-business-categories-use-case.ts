import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { ListStoreBusinessCategoriesUseCase } from "../store-business-category/list-store-business-categories";

export function makeListStoreBusinessCategoriesUseCase() {
  const storeBusinessCategoryRepository =
    new PrismaStoreBusinessCategoryRepository();

  const useCase = new ListStoreBusinessCategoriesUseCase(
    storeBusinessCategoryRepository,
  );

  return useCase;
}
