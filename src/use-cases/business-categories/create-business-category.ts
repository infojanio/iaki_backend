import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";
import { BusinessCategory } from "@prisma/client";

interface CreateBusinessCategoryUseCaseRequest {
  id?: string;
  name: string;
  cityId: string;
  image?: string | null;
}

interface CreateBusinessCategoryUseCaseResponse {
  category: BusinessCategory;
}

export class CreateBusinessCategoryUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    id,
    name,
    cityId,
    image,
  }: CreateBusinessCategoryUseCaseRequest): Promise<CreateBusinessCategoryUseCaseResponse> {
    const categoryExists =
      await this.businessCategoriesRepository.findByName(name);

    if (categoryExists) {
      throw new Error("Essa categoria de negócio já existe!");
    }

    const category = await this.businessCategoriesRepository.create({
      id,
      name,
      image,
      cityId,
      createdAt: new Date(),
    });

    return { category };
  }
}
