import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { UpdateBusinessCategoryUseCase } from "../business-categories/update-business-category";

export function makeUpdateBusinessCategoryUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new UpdateBusinessCategoryUseCase(
    businessCategoriesRepository,
  );

  return useCase;
}
