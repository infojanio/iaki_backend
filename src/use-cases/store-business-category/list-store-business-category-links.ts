import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

interface ListStoreBusinessCategoryLinksUseCaseRequest {
  categoryId: string;
}

interface ListStoreBusinessCategoryLinksUseCaseResponse {
  links: any[];
}

export class ListStoreBusinessCategoryLinksUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    categoryId,
  }: ListStoreBusinessCategoryLinksUseCaseRequest): Promise<ListStoreBusinessCategoryLinksUseCaseResponse> {
    if (!categoryId) {
      throw new Error("categoryId is required");
    }

    const links =
      await this.storeBusinessCategoryRepository.findByCategoryId(categoryId);

    return { links };
  }
}
