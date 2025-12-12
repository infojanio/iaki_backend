import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { SearchBusinessCategoryUseCase } from "../business-category/search-business-category";

export function makeSearchBusinessCategoryUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new SearchBusinessCategoryUseCase(
    businessCategoriesRepository,
  );

  return useCase;
}
