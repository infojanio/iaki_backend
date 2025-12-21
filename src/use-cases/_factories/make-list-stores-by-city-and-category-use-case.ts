import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListStoresByCityAndCategoryUseCase } from "../cities/list-stores-by-city-and-category";

export function makeListStoresByCityAndCategoryUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new ListStoresByCityAndCategoryUseCase(storesRepository);

  return useCase;
}
