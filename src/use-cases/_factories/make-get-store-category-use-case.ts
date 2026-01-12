import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { GetStoreCategoryUseCase } from "../store-category/get-store-category";

export function makeGetStoreCategoryUseCase() {
  const repository = new PrismaStoreCategoryRepository();
  const useCase = new GetStoreCategoryUseCase(repository);

  return useCase; // ✅ ISSO RESOLVE
}
