import { BusinessCategoryCityRepository } from "@/repositories/prisma/Iprisma/business-category-city-repository";

type LinkBusinessCategoryToCityUseCaseRequest = {
  businessCategoryId: string;
  cityId: string;
};

export class LinkBusinessCategoryToCityUseCase {
  constructor(private repository: BusinessCategoryCityRepository) {}

  async execute({ businessCategoryId, cityId }: any) {
    await this.repository.create({ businessCategoryId, cityId });
  }
}
