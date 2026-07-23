import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { ListPremiumStoresByCityUseCase } from "../stores/list-premium-stores-by-city";

export function makeListPremiumStoresByCityUseCase() {
  const storesRepository = new PrismaStoresRepository();

  return new ListPremiumStoresByCityUseCase(storesRepository);
}
