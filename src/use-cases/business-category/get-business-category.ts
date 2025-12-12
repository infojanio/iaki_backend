import { BusinessCategory } from "@prisma/client";
import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface GetBusinessCategoryUseCaseRequest {
  id: string;
}

interface GetBusinessCategoryUseCaseResponse {
  category: BusinessCategory;
}

export class GetBusinessCategoryUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    id,
  }: GetBusinessCategoryUseCaseRequest): Promise<GetBusinessCategoryUseCaseResponse> {
    const category = await this.businessCategoriesRepository.findById(id);

    if (!category) {
      throw new Error("Categoria de negócio não encontrada!");
    }

    return { category };
  }
}
