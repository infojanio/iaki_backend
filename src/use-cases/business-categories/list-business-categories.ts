import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";
import { BusinessCategory } from "@prisma/client";

interface ListBusinessCategoriesUseCaseResponse {
  categories: BusinessCategory[];
}

export class ListBusinessCategoriesUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute(): Promise<ListBusinessCategoriesUseCaseResponse> {
    const categories = await this.businessCategoriesRepository.findAll();
    return { categories };
  }
}
