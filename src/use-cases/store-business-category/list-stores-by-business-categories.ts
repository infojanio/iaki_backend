import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";
import { Store } from "@prisma/client";

interface ListStoresByBusinessCategoriesUseCaseRequest {
  categoryId: string;
}

interface ListStoresByBusinessCategoriesUseCaseResponse {
  stores: Store[];
}

export class ListStoresByBusinessCategoriesUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    categoryId,
  }: ListStoresByBusinessCategoriesUseCaseRequest): Promise<ListStoresByBusinessCategoriesUseCaseResponse> {
    if (!categoryId) {
      throw new Error("categoryId is required");
    }

    const stores =
      await this.storeBusinessCategoryRepository.findManyStoresByCategoryId(
        categoryId,
      );

    return { stores };
  }
}
