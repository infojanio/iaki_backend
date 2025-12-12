import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface DeleteStoreBusinessCategoryUseCaseRequest {
  id: string;
}

export class DeleteStoreBusinessCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({ id }: DeleteStoreBusinessCategoryUseCaseRequest) {
    const relation = await this.storeBusinessCategoryRepository.findById(id);

    if (!relation) {
      throw new Error("Relação loja-categoria não encontrada!");
    }

    await this.storeBusinessCategoryRepository.delete(id);
  }
}
