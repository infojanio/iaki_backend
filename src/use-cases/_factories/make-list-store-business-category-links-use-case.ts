import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { ListStoreBusinessCategoryLinksUseCase } from "../store-business-category/list-store-business-category-links";

export function makeListStoreBusinessCategoryLinksUseCase() {
  const repository = new PrismaStoreBusinessCategoryRepository();
  return new ListStoreBusinessCategoryLinksUseCase(repository);
}
