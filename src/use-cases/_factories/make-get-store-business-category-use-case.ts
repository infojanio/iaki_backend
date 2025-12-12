import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { GetStoreBusinessCategoryUseCase } from "../store-business-category/get-store-business-category";

export function makeGetStoreBusinessCategoryUseCase() {
  const repository = new PrismaStoreBusinessCategoryRepository();
  const useCase = new GetStoreBusinessCategoryUseCase(repository);

  return useCase; // ✅ ISSO RESOLVE
}
