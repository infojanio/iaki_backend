import { PrismaBusinessCategoryCityRepository } from "@/repositories/prisma/prisma-business-category-city-repository";
import { LinkBusinessCategoryToCityUseCase } from "../business-categories/link-business-category-to-city";

export function makeLinkBusinessCategoryToCityUseCase() {
  return new LinkBusinessCategoryToCityUseCase(
    new PrismaBusinessCategoryCityRepository(),
  );
}
