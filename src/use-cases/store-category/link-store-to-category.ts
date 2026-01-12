import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface LinkStoreCategoryUseCaseRequest {
  storeId: string;
  categoryId: string;
}

export class LinkStoreCategoryUseCase {
  constructor(private storeCategoryRepository: StoreCategoryRepository) {}

  async execute({ storeId, categoryId }: LinkStoreCategoryUseCaseRequest) {
    if (!storeId || !categoryId) {
      throw new Error("storeId and categoryId are required");
    }

    const alreadyLinked =
      await this.storeCategoryRepository.findByStoreAndCategory({
        storeId,
        categoryId,
      });

    if (alreadyLinked) {
      throw new Error("Category already linked to this store");
    }

    return this.storeCategoryRepository.create({
      storeId,
      categoryId,
    });
  }
}
