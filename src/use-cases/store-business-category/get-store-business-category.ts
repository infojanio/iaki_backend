import { StoreBusinessCategory } from "@prisma/client";
import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface GetStoreBusinessCategoryUseCaseRequest {
  id: string;
}

interface GetStoreBusinessCategoryUseCaseResponse {
  relation: StoreBusinessCategory;
}

export class GetStoreBusinessCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    id,
  }: GetStoreBusinessCategoryUseCaseRequest): Promise<GetStoreBusinessCategoryUseCaseResponse> {
    const relation = await this.storeBusinessCategoryRepository.findById(id);

    if (!relation) {
      throw new Error("Relação não encontrada!");
    }

    return { relation };
  }
}
