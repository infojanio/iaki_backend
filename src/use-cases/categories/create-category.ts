import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";
import { Category } from "@prisma/client";
interface CreateCategoryUseCaseRequest {
  id?: string;
  name: string;
  image: string | null;
  createdAt: Date;
  // subcategory: string
}
interface CreateCategoryUseCaseResponse {
  category: Category;
}
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}
  async execute({
    id,
    name,
    image,
    createdAt,
  }: // subcategory,
  CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const category = await this.categoriesRepository.create({
      id,
      name,
      image,
      createdAt,
      // SubCategory: subcategory,
    });
    return {
      category,
    };
  }
}
