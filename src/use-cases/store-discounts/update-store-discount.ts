import { Prisma, StoreDiscount } from "@prisma/client";
import { StoreDiscountRepository } from "@/repositories/prisma/Iprisma/store-discount-repository";

interface UpdateStoreDiscountUseCaseRequest {
  id: string;
  data: {
    value?: number;
    type?: "FIXED" | "DAILY" | "WEEKLY";
    title?: string;
    description?: string;
    validFrom?: Date;
    validTo?: Date;
    isActive?: boolean;
  };
}

export class UpdateStoreDiscountUseCase {
  constructor(private repository: StoreDiscountRepository) {}

  async execute({
    id,
    data,
  }: UpdateStoreDiscountUseCaseRequest): Promise<StoreDiscount> {
    const discount = await this.repository.findById(id);

    if (!discount) {
      throw new Error("Desconto não encontrado");
    }

    const prismaData: Prisma.StoreDiscountUncheckedUpdateInput = {
      ...data,
      value:
        data.value !== undefined ? new Prisma.Decimal(data.value) : undefined,
    };

    return await this.repository.update(id, prismaData);
  }
}
