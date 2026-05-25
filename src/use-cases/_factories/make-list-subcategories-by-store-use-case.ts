import { PrismaSubCategoriesRepository } from "@/repositories/prisma/prisma-subcategories-repository";

import { ListSubcategoriesByStoreUseCase } from "../subcategories/list-subcategories-by-store-use-case";

export function makeListSubcategoriesByStoreUseCase() {
  const subcategoriesRepository = new PrismaSubCategoriesRepository();

  return new ListSubcategoriesByStoreUseCase(subcategoriesRepository);
}
