import { PrismaStoreCategoryRepository } from "@/repositories/prisma/prisma-store-category-repository";
import { LinkStoreCategoryUseCase } from "../store-category/link-store-to-category";

export function makeLinkStoreCategoryUseCase() {
  const repository = new PrismaStoreCategoryRepository();
  return new LinkStoreCategoryUseCase(repository);
}
