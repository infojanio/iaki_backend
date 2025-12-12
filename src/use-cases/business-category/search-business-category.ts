import { BusinessCategory } from "@prisma/client";
import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface SearchBusinessCategoryUseCaseRequest {
  query: string;
}

interface SearchBusinessCategoryUseCaseResponse {
  categories: BusinessCategory[];
}

export class SearchBusinessCategoryUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    query,
  }: SearchBusinessCategoryUseCaseRequest): Promise<SearchBusinessCategoryUseCaseResponse> {
    const categories = await this.businessCategoriesRepository.search(query);
    return { categories };
  }
}
