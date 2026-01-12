import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { DeleteStoreCategoryUseCase } from "../store-category/delete-store-category";

export function makeDeleteStoreCategoryUseCase() {
  const storeCategoryRepository = new PrismaStoreCategoryRepository();

  const useCase = new DeleteStoreCategoryUseCase(storeCategoryRepository);

  return useCase;
}
