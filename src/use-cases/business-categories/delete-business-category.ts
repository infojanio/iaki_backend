import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface DeleteBusinessCategoryUseCaseRequest {
  id: string;
}

export class DeleteBusinessCategoryUseCase {
  constructor(
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({ id }: DeleteBusinessCategoryUseCaseRequest) {
    const category = await this.businessCategoriesRepository.findById(id);

    if (!category) {
      throw new Error("Categoria não encontrada!");
    }

    await this.businessCategoriesRepository.delete(id);
  }
}
