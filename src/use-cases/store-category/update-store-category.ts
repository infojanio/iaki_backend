import { StoreCategory } from "@prisma/client";
import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface UpdateStoreCategoryUseCaseRequest {
  id: string;
  storeId?: string;
  categoryId?: string;
}

interface UpdateStoreCategoryUseCaseResponse {
  relation: StoreCategory;
}

export class UpdateStoreCategoryUseCase {
  constructor(private storeCategoryRepository: StoreCategoryRepository) {}

  async execute({
    id,
    storeId,
    categoryId,
  }: UpdateStoreCategoryUseCaseRequest): Promise<UpdateStoreCategoryUseCaseResponse> {
    const relation = await this.storeCategoryRepository.findById(id);

    if (!relation) throw new Error("Relação não encontrada!");

    const updated = await this.storeCategoryRepository.update(id, {
      storeId,
      categoryId,
    });

    return { relation: updated };
  }
}
