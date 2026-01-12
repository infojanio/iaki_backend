import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListStoreByCityUseCase } from "../stores/list-stores-by-city";

export function makeListStoresByCityUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new ListStoreByCityUseCase(storesRepository);

  return useCase;
}
