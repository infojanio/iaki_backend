import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { Store, StoreBusinessCategory } from "@prisma/client";

interface ListStoresByBusinessCategoryUseCaseRequest {
  categoryId: string;
}

interface ListStoresByBusinessCategoryUseCaseResponse {
  stores: Store[];
}

export class ListStoresByBusinessCategoryUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({
    categoryId,
  }: ListStoresByBusinessCategoryUseCaseRequest): Promise<ListStoresByBusinessCategoryUseCaseResponse> {
    if (!categoryId) {
      throw new Error("categoryId is required");
    }

    const stores =
      await this.storesRepository.findManyByBusinessCategoryId(categoryId);

    return { stores };
  }
}
