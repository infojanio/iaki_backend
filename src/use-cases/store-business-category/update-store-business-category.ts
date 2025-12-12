import { StoreBusinessCategory } from "@prisma/client";
import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface UpdateStoreBusinessCategoryUseCaseRequest {
  id: string;
  storeId?: string;
  categoryId?: string;
}

interface UpdateStoreBusinessCategoryUseCaseResponse {
  relation: StoreBusinessCategory;
}

export class UpdateStoreBusinessCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    id,
    storeId,
    categoryId,
  }: UpdateStoreBusinessCategoryUseCaseRequest): Promise<UpdateStoreBusinessCategoryUseCaseResponse> {
    const relation = await this.storeBusinessCategoryRepository.findById(id);

    if (!relation) throw new Error("Relação não encontrada!");

    const updated = await this.storeBusinessCategoryRepository.update(id, {
      storeId,
      categoryId,
    });

    return { relation: updated };
  }
}
