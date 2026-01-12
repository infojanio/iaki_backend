import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface DeleteStoreCategoryUseCaseRequest {
  id: string;
}

export class DeleteStoreCategoryUseCase {
  constructor(private storeCategoryRepository: StoreCategoryRepository) {}

  async execute({ id }: DeleteStoreCategoryUseCaseRequest) {
    const relation = await this.storeCategoryRepository.findById(id);

    if (!relation) {
      throw new Error("Relação loja-categoria não encontrada!");
    }

    await this.storeCategoryRepository.delete(id);
  }
}
