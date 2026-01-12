import { StoreCategory } from "@prisma/client";
import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface GetStoreCategoryUseCaseRequest {
  id: string;
}

interface GetStoreCategoryUseCaseResponse {
  relation: StoreCategory;
}

export class GetStoreCategoryUseCase {
  constructor(private storeCategoryRepository: StoreCategoryRepository) {}

  async execute({
    id,
  }: GetStoreCategoryUseCaseRequest): Promise<GetStoreCategoryUseCaseResponse> {
    const relation = await this.storeCategoryRepository.findById(id);

    if (!relation) {
      throw new Error("Relação não encontrada!");
    }

    return { relation };
  }
}
