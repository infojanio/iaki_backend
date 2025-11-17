import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListStoresActiveUseCase } from "../stores/list-stores-active";
export function makeListStoresActiveUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new ListStoresActiveUseCase(storesRepository);
  return useCase;
}
