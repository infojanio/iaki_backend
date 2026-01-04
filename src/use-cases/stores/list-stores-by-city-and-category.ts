import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface ListStoresByCityAndCategoryUseCaseRequest {
  cityId: string;
  categoryId: string;
}

export class ListStoresByCityAndCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    cityId,
    categoryId,
  }: ListStoresByCityAndCategoryUseCaseRequest) {
    if (!cityId || !categoryId) {
      throw new Error("cityId and categoryId are required");
    }

    const stores =
      await this.storeBusinessCategoryRepository.findManyStoresByCategoryAndCity(
        categoryId,
        cityId,
      );

    return { stores };
  }
}
