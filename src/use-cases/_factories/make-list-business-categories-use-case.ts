import { PrismaBusinessCategoriesRepository } from "@/repositories/prisma/prisma-business-category-repository";
import { ListBusinessCategoriesUseCase } from "../business-categories/list-business-categories";

export function makeListBusinessCategoriesUseCase() {
  const repository = new PrismaBusinessCategoriesRepository();
  return new ListBusinessCategoriesUseCase(repository);
}
