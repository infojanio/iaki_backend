import { StoreBusinessCategory } from "@prisma/client";
import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { BusinessCategoriesRepository } from "@/repositories/prisma/Iprisma/business-category-repository ";

interface CreateStoreBusinessCategoryUseCaseRequest {
  storeId: string;
  categoryId: string;
}

interface CreateStoreBusinessCategoryUseCaseResponse {
  relation: StoreBusinessCategory;
}

export class CreateStoreBusinessCategoryUseCase {
  constructor(
    private storeBusinessCategoryRepository: StoreBusinessCategoryRepository,
    private storesRepository: StoresRepository,
    private businessCategoriesRepository: BusinessCategoriesRepository,
  ) {}

  async execute({
    storeId,
    categoryId,
  }: CreateStoreBusinessCategoryUseCaseRequest): Promise<CreateStoreBusinessCategoryUseCaseResponse> {
    // Verificar se a loja existe
    const storeExists = await this.storesRepository.findById(storeId);
    if (!storeExists) {
      throw new Error("Loja não encontrada!");
    }

    // Verificar se a categoria existe
    const categoryExists =
      await this.businessCategoriesRepository.findById(categoryId);
    if (!categoryExists) {
      throw new Error("Categoria não encontrada!");
    }

    // Verificar se relação já existe
    const alreadyExists =
      await this.storeBusinessCategoryRepository.findByStoreAndCategory(
        storeId,
        categoryId,
      );

    if (alreadyExists) {
      throw new Error("Esta loja já pertence a essa categoria.");
    }

    const relation = await this.storeBusinessCategoryRepository.create({
      storeId,
      categoryId,
    });

    return { relation };
  }
}
