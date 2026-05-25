import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";

interface Request {
  storeId: string;
}

export class ListCategoriesByStoreUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({ storeId }: Request) {
    const categories =
      await this.categoriesRepository.findManyByStoreId(storeId);

    return {
      categories,
    };
  }
}
