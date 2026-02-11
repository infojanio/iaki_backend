import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";
import { Category } from "@prisma/client";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface UpdateCategoryUseCaseRequest {
  id: string;
  name?: string;
  image?: string;
  categoryId?: string;
}

interface UpdateCategoryUseCaseResponse {
  updatedCategory: Category;
}

export class UpdateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
    ...data
  }: UpdateCategoryUseCaseRequest): Promise<UpdateCategoryUseCaseResponse> {
    // Verifica se o category existe
    const existingCategory = await this.categoriesRepository.findById(id);

    if (!existingCategory) {
      throw new ResourceNotFoundError();
    }

    // Formata os dados de quantidade para o Prisma
    const updateData = {
      ...data,
    };

    // Atualiza o produto
    const updatedCategory = await this.categoriesRepository.update(
      id,
      updateData,
    );

    return { updatedCategory };
  }
}
