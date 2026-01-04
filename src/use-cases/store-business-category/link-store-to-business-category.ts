import { StoreBusinessCategoryRepository } from "@/repositories/prisma/Iprisma/store-business-category-repository";

export class LinkStoreToBusinessCategoryUseCase {
  constructor(private repository: StoreBusinessCategoryRepository) {}

  async execute({ storeId, categoryId }: any) {
    await this.repository.create({ storeId, categoryId });
  }
}
