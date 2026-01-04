import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { ListStoresByBusinessCategoriesUseCase } from "@/use-cases/store-business-category/list-stores-by-business-categories";

export function makeListStoresByBusinessCategoriesUseCase() {
  const repo = new PrismaStoreBusinessCategoryRepository();
  return new ListStoresByBusinessCategoriesUseCase(repo);
}
