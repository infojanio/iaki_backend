import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ToggleStoreStatusUseCase } from "../stores/toggle-store-status";
export function makeToggleStoreStatusUseCase() {
  const toggleStoreStatusRepository = new PrismaStoresRepository();
  const useCase = new ToggleStoreStatusUseCase(toggleStoreStatusRepository);
  return useCase;
}
