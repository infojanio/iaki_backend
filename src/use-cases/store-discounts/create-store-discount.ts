import { StoreDiscount, DiscountType } from "@prisma/client";
import { StoreDiscountRepository } from "@/repositories/prisma/Iprisma/store-discount-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface CreateStoreDiscountRequest {
  storeId: string;
  type: DiscountType;
  value: number;
  title?: string;
  description?: string;
  validFrom?: Date;
  validTo?: Date;
}

export class CreateStoreDiscountUseCase {
  constructor(
    private storeDiscountRepository: StoreDiscountRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute(data: CreateStoreDiscountRequest): Promise<StoreDiscount> {
    const store = await this.storesRepository.findById(data.storeId);
    if (!store) throw new Error("Loja não encontrada");

    // regra: apenas um desconto ativo
    await this.storeDiscountRepository.deactivateByStoreId(data.storeId);

    return this.storeDiscountRepository.create({
      ...data,
      isActive: true,
      createdAt: new Date(),
    });
  }
}
