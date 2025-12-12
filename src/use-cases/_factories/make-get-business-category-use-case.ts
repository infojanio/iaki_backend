import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { GetBusinessCategoryUseCase } from "../business-category/get-business-category";

export function makeGetBusinessCategoryUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new GetBusinessCategoryUseCase(businessCategoriesRepository);

  return useCase;
}
