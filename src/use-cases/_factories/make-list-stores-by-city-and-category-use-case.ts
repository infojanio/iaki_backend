import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { ListStoresByCityAndCategoryUseCase } from "../stores/list-stores-by-city-and-category";

export function makeListStoresByCityAndCategoryUseCase() {
  const storesRepository = new PrismaStoreBusinessCategoryRepository();
  const useCase = new ListStoresByCityAndCategoryUseCase(storesRepository);

  return useCase;
}
