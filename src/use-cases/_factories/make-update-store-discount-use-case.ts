import { PrismaStoreDiscountRepository } from "@/repositories/prisma/prisma-store-discount-repository";
import { UpdateStoreDiscountUseCase } from "../store-discounts/update-store-discount";

export function makeUpdateStoreDiscountUseCase() {
  const storeDiscountRepository = new PrismaStoreDiscountRepository();

  const useCase = new UpdateStoreDiscountUseCase(storeDiscountRepository);

  return useCase;
}
