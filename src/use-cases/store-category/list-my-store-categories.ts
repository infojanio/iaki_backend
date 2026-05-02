import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface ListMyStoreCategoriesUseCaseRequest {
  storeId: string;
}

export class ListMyStoreCategoriesUseCase {
  constructor(private storeCategoriesRepository: StoreCategoryRepository) {}

  async execute({ storeId }: ListMyStoreCategoriesUseCaseRequest) {
    const storeCategories =
      await this.storeCategoriesRepository.findManyByStoreId(storeId);

    return {
      categories: storeCategories.map((item: any) => ({
        id: item.category.id,
        name: item.category.name,
        image: item.category.image,
        storeCategoryId: item.id,
      })),
    };
  }
}
