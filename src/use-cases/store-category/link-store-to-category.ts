import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";
import { StoreCategoryAlreadyLinkedError } from "@/utils/messages/errors/store-category-already-linked-error";

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
      throw new StoreCategoryAlreadyLinkedError();
    }

    return this.storeCategoryRepository.create({
      storeId,
      categoryId,
    });
  }
}
