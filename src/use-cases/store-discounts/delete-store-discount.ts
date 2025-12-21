import { StoreDiscountRepository } from "@/repositories/prisma/Iprisma/store-discount-repository";

export class DeleteStoreDiscountUseCase {
  constructor(private repository: StoreDiscountRepository) {}

  async execute(id: string) {
    const exists = await this.repository.findById(id);
    if (!exists) throw new Error("Desconto não encontrado");

    await this.repository.delete(id);
  }
}
