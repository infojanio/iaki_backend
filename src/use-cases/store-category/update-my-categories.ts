import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface UpdateMyStoreCategoriesUseCaseRequest {
  storeId: string;
  categoryIds: string[];
}

export class UpdateMyStoreCategoriesUseCase {
  constructor(private storeCategoriesRepository: StoreCategoryRepository) {}

  async execute({
    storeId,
    categoryIds,
  }: UpdateMyStoreCategoriesUseCaseRequest) {
    await this.storeCategoriesRepository.replaceStoreCategories(
      storeId,
      categoryIds,
    );
  }
}
