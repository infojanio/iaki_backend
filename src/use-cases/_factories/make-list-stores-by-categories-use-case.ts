import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { ListStoresByCategoriesUseCase } from "@/use-cases/store-category/list-stores-by-categories";

export function makeListStoresByCategoriesUseCase() {
  const repo = new PrismaStoreCategoryRepository();
  return new ListStoresByCategoriesUseCase(repo);
}
