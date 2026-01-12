import { PrismaCategoriesRepository } from "@/repositories/prisma/prisma-categories-repository";
import { GetStoreCategoriesUseCase } from "../stores/get-store-categories";

export function makeGetStoreCategoriesUseCase() {
  const categoriesRepository = new PrismaCategoriesRepository();
  return new GetStoreCategoriesUseCase(categoriesRepository);
}
