import { SubCategoriesRepository } from "@/repositories/prisma/Iprisma/subcategories-repository";

interface Request {
  storeId: string;
}

export class ListSubcategoriesByStoreUseCase {
  constructor(private subcategoriesRepository: SubCategoriesRepository) {}

  async execute({ storeId }: Request) {
    const subcategories =
      await this.subcategoriesRepository.findManyByStoreId(storeId);

    return {
      subcategories,
    };
  }
}
