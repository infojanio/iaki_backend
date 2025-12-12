import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { UpdateStoreBusinessCategoryUseCase } from "../store-business-category/update-store-business-category";

export function makeUpdateStoreBusinessCategoryUseCase() {
  const storeBusinessCategoryRepository =
    new PrismaStoreBusinessCategoryRepository();

  const useCase = new UpdateStoreBusinessCategoryUseCase(
    storeBusinessCategoryRepository,
  );

  return useCase;
}
