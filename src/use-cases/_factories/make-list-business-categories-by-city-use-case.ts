import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { ListBusinessCategoriesByCityUseCase } from "../business-categories/list-business-categories-by-city";

export function makeListBusinessCategoriesByCityUseCase() {
  const businessCategoriesRepository = new PrismaBusinessCategoriesRepository();

  return new ListBusinessCategoriesByCityUseCase(businessCategoriesRepository);
}
