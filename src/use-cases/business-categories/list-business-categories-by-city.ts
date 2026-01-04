import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";
import { BusinessCategory } from "@prisma/client";

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
    if (!cityId) {
      throw new Error("CityId is required");
    }
    const categories =
      await this.businessCategoriesRepository.findManyByCityId(cityId);

    return { categories };
  }
}
