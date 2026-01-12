import { StoreCategory } from "@prisma/client";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { CategoriesRepository } from "@/repositories/prisma/Iprisma/categories-repository";
import { StoreCategoryRepository } from "@/repositories/prisma/Iprisma/store-category-repository";

interface CreateStoreCategoryUseCaseRequest {
  storeId: string;
  categoryId: string;
}

interface CreateStoreCategoryUseCaseResponse {
  relation: StoreCategory;
}

export class CreateStoreCategoryUseCase {
  constructor(
    private storeCategoryRepository: StoreCategoryRepository,
    private storesRepository: StoresRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute({
    storeId,
    categoryId,
  }: CreateStoreCategoryUseCaseRequest): Promise<CreateStoreCategoryUseCaseResponse> {
    // Verificar se a loja existe
    const storeExists = await this.storesRepository.findById(storeId);
    if (!storeExists) {
      throw new Error("Loja não encontrada!");
    }

    // Verificar se a categoria existe
    const categoryExists = await this.categoriesRepository.findById(categoryId);
    if (!categoryExists) {
      throw new Error("Categoria não encontrada!");
    }

    // Verificar se relação já existe
    const alreadyExists =
      await this.storeCategoryRepository.findManyStoresByCategoryAndStore(
        storeId,
        categoryId,
      );

    if (alreadyExists) {
      throw new Error("Esta loja já pertence a essa categoria.");
    }

    const relation = await this.storeCategoryRepository.create({
      storeId,
      categoryId,
    });

    return { relation };
  }
}
