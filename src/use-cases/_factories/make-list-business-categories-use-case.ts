import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { ListBusinessCategoriesUseCase } from "../business-category/list-business-categories";

export function makeListBusinessCategoriesUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  const useCase = new ListBusinessCategoriesUseCase(
    businessCategoriesRepository,
  );

  return useCase;
}
