import { BusinessCategory } from "@prisma/client";
import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface ListBusinessCategoriesUseCaseResponse {
  categories: BusinessCategory[];
}

export class ListBusinessCategoriesUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute(): Promise<ListBusinessCategoriesUseCaseResponse> {
    const categories = await this.businessCategoriesRepository.findMany();
    return { categories };
  }
}
