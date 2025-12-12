import { StoreBusinessCategory } from "@prisma/client";
import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface ListStoreBusinessCategoriesUseCaseResponse {
  relations: StoreBusinessCategory[];
}

export class ListStoreBusinessCategoriesUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute(): Promise<ListStoreBusinessCategoriesUseCaseResponse> {
    const relations = await this.storeBusinessCategoryRepository.findMany();
    return { relations };
  }
}
