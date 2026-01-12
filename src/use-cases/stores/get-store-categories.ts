import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";

interface GetStoreCategoriesUseCaseRequest {
  storeId: string;
}

export class GetStoreCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ storeId }: GetStoreCategoriesUseCaseRequest) {
    return this.categoriesRepository.findManyByStoreId(storeId);
  }
}
