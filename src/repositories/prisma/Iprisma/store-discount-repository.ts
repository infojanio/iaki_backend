import { StoreDiscount, Prisma } from "@prisma/client";

export interface StoreDiscountRepository {
  findById(id: string): Promise<StoreDiscount | null>;
  findActiveByStoreId(storeId: string): Promise<StoreDiscount | null>;
  findManyByStoreId(storeId: string): Promise<StoreDiscount[]>;

  create(
    data: Prisma.StoreDiscountUncheckedCreateInput,
  ): Promise<StoreDiscount>;
  update(
    id: string,
    data: Prisma.StoreDiscountUncheckedUpdateInput,
  ): Promise<StoreDiscount>;

  deactivateByStoreId(storeId: string): Promise<void>;
  delete(id: string): Promise<void>;
}
