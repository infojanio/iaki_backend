import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { FetchStoreByIdUseCase } from "../stores/fetch-store-by-id";

export function makeFetchStoreByIdUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new FetchStoreByIdUseCase(storesRepository);

  return useCase;
}
