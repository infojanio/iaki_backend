import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { DeleteStoreBusinessCategoryUseCase } from "../store-business-category/delete-store-business-category";

export function makeDeleteStoreBusinessCategoryUseCase() {
  const storeBusinessCategoryRepository =
    new PrismaStoreBusinessCategoryRepository();

  const useCase = new DeleteStoreBusinessCategoryUseCase(
    storeBusinessCategoryRepository,
  );

  return useCase;
}
