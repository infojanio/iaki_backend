import { PrismaStoreDiscountRepository } from "@/repositories/prisma/prisma-store-discount-repository";
import { DeleteStoreDiscountUseCase } from "../store-discounts/delete-store-discount";

export function makeDeleteStoreDiscountUseCase() {
  const storeDiscountRepository = new PrismaStoreDiscountRepository();

  const useCase = new DeleteStoreDiscountUseCase(storeDiscountRepository);

  return useCase;
}
