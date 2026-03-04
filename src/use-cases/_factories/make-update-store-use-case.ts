import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { UpdateStoreUseCase } from "../stores/update-store-use";

export function makeUpdateStoreUseCase() {
  const storesRepository = new PrismaStoresRepository();
  const useCase = new UpdateStoreUseCase(storesRepository);

  return useCase;
}
