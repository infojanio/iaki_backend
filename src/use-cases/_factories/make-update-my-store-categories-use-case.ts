import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { UpdateMyStoreCategoriesUseCase } from "../store-category/update-my-categories";

export function makeUpdateMyStoreCategoriesUseCase() {
  const storeCategoriesRepository = new PrismaStoreCategoryRepository();

  return new UpdateMyStoreCategoriesUseCase(storeCategoriesRepository);
}
