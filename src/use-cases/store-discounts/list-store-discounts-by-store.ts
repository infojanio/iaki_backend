import { StoreDiscount } from "@prisma/client";
import { StoreDiscountRepository } from "@/repositories/prisma/Iprisma/store-discount-repository";

export class ListStoreDiscountsByStoreUseCase {
  constructor(private repository: StoreDiscountRepository) {}

  async execute(storeId: string): Promise<StoreDiscount[]> {
    return this.repository.findManyByStoreId(storeId);
  }
}
