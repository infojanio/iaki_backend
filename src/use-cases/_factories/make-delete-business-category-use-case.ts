import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { DeleteBusinessCategoryUseCase } from "../business-categories/delete-business-category";

export function makeDeleteBusinessCategoryUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new DeleteBusinessCategoryUseCase(
    businessCategoriesRepository,
  );

  return useCase;
}
