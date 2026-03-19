import { ListStoreBusinessCategoryLinksUseCase } from "@/http/controllers/store-business-category/list-store-business-category-links";
import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";

export function makeListStoreBusinessCategoryLinksUseCase() {
  const repository = new PrismaStoreBusinessCategoryRepository();
  return new ListStoreBusinessCategoryLinksUseCase(repository);
}
