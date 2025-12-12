import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";
import { StoreBusinessCategory } from "@prisma/client";

interface SearchStoreBusinessCategoryUseCaseRequest {
  query: string;
}

interface SearchStoreBusinessCategoryUseCaseResponse {
  results: StoreBusinessCategory[];
}

export class SearchStoreBusinessCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
  ) {}

  async execute({
    query,
  }: SearchStoreBusinessCategoryUseCaseRequest): Promise<SearchStoreBusinessCategoryUseCaseResponse> {
    const results = await this.storeBusinessCategoryRepository.search(query);

    return { results };
  }
}
