import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";

import { ListCategoriesByStoreUseCase } from "../categories/list-categories-by-store-use-case";

export function makeListCategoriesByStoreUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository();

  return new ListCategoriesByStoreUseCase(categoriesRepository);
}
