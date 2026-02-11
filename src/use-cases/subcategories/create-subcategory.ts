import { SubCategoriesRepository } from "@/repositories/prisma/Iprisma/subcategories-repository";
import { SubCategory, Prisma } from "@prisma/client";
interface CreateSubCategoryUseCaseRequest {
  id?: string;
  name: string;
  image: string | null;
  categoryId: string;
  createdAt: Date;
  //products: string
}
interface CreateSubCategoryUseCaseResponse {
  subcategory: SubCategory;
}
export class CreateSubCategoryUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}
  async execute({
    id,
    name,
    image,
    categoryId,
    createdAt,
  }: //products,
  CreateSubCategoryUseCaseRequest): Promise<CreateSubCategoryUseCaseResponse> {
    const subcategory = await this.subcategoriesRepository.create({
      id,
      name,
      image,
      categoryId,
      createdAt,
      //products,
    });
    return {
      subcategory,
    };
  }
}
