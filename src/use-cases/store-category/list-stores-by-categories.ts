import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";
import { Store } from "@prisma/client";

interface ListStoresByCategoriesUseCaseRequest {
  categoryId: string;
}

interface ListStoresByCategoriesUseCaseResponse {
  stores: Store[];
}

export class ListStoresByCategoriesUseCase {
  constructor(private storeCategoryRepository: StoreCategoryRepository) {}

  async execute({
    categoryId,
  }: ListStoresByCategoriesUseCaseRequest): Promise<ListStoresByCategoriesUseCaseResponse> {
    if (!categoryId) {
      throw new Error("categoryId is required");
    }

    const stores =
      await this.storeCategoryRepository.findManyStoresByCategoryId(categoryId);

    return { stores };
  }
}
