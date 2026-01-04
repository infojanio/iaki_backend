import { PrismaStoreBusinessCategoryRepository } from "@/repositories/prisma/prisma-store-business-category-repository";
import { LinkStoreToBusinessCategoryUseCase } from "../store-business-category/link-store-to-business-category";

export function makeLinkStoreToBusinessCategoryUseCase() {
  return new LinkStoreToBusinessCategoryUseCase(
    new PrismaStoreBusinessCategoryRepository(),
  );
}
