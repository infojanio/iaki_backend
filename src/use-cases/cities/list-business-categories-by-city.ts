import { BusinessCategory } from "@prisma/client";
import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface ListBusinessCategoriesByCityUseCaseRequest {
  cityId: string;
}

interface ListBusinessCategoriesByCityUseCaseResponse {
  categories: BusinessCategory[];
}

export class ListBusinessCategoriesByCityUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    cityId,
  }: ListBusinessCategoriesByCityUseCaseRequest): Promise<ListBusinessCategoriesByCityUseCaseResponse> {
    const categories =
      await this.businessCategoriesRepository.findManyByCityId(cityId);

    return { categories };
  }
}
