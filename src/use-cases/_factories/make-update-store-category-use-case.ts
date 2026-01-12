import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { UpdateStoreCategoryUseCase } from "../store-category/update-store-category";

export function makeUpdateStoreCategoryUseCase() {
  const storeCategoryRepository = new PrismaStoreCategoryRepository();

  const useCase = new UpdateStoreCategoryUseCase(storeCategoryRepository);

  return useCase;
}
