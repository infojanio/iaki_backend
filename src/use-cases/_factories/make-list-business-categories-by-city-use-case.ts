import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { ListBusinessCategoriesByCityUseCase } from "../cities/list-business-categories-by-city";

export function makeListBusinessCategoriesByCityUseCase() {
  const repository = new PrismaBusinessCategoriesRepository();
  const useCase = new ListBusinessCategoriesByCityUseCase(repository);

  return useCase;
}
