import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";
import { BusinessCategory } from "@prisma/client";

interface UpdateBusinessCategoryUseCaseRequest {
  id: string;
  name?: string;
  image?: string | null;
}

interface UpdateBusinessCategoryUseCaseResponse {
  category: BusinessCategory;
}

export class UpdateBusinessCategoryUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    id,
    name,
    image,
  }: UpdateBusinessCategoryUseCaseRequest): Promise<UpdateBusinessCategoryUseCaseResponse> {
    const categoryExists = await this.businessCategoriesRepository.findById(id);

    if (!categoryExists) {
      throw new Error("Categoria de negócio não encontrada!");
    }

    const category = await this.businessCategoriesRepository.update(id, {
      name,
      image,
    });

    return { category };
  }
}
