import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { CreateBusinessCategoryUseCase } from "../business-categories/create-business-category";

export function makeCreateBusinessCategoryUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new CreateBusinessCategoryUseCase(
    businessCategoriesRepository,
  );

  return useCase;
}
