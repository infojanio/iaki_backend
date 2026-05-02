import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { ListMyStoreCategoriesUseCase } from "../store-category/list-my-store-categories";

export function makeListMyStoreCategoriesUseCase() {
  const storeCategoriesRepository = new PrismaStoreCategoryRepository();

  return new ListMyStoreCategoriesUseCase(storeCategoriesRepository);
}
