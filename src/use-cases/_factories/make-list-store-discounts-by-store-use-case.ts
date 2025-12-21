import { PrismaStoreDiscountRepository } from "@/repositories/prisma/prisma-store-discount-repository";
import { ListStoreDiscountsByStoreUseCase } from "../store-discounts/list-store-discounts-by-store";

export function makeListStoreDiscountsByStoreUseCase() {
  const storeDiscountRepository = new PrismaStoreDiscountRepository();

  const useCase = new ListStoreDiscountsByStoreUseCase(storeDiscountRepository);

  return useCase;
}
