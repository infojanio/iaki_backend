import { PrismaStoreDiscountRepository } from "@/repositories/prisma/prisma-store-discount-repository";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { CreateStoreDiscountUseCase } from "../store-discounts/create-store-discount";

export function makeCreateStoreDiscountUseCase() {
  const storeDiscountRepository = new PrismaStoreDiscountRepository();
  const storesRepository = new PrismaStoresRepository();

  const useCase = new CreateStoreDiscountUseCase(
    storeDiscountRepository,
    storesRepository,
  );

  return useCase;
}
