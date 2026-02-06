import { prisma } from "@/lib/prisma";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";
import { GetLowStockProductsUseCase } from "../products/get-low-stock-products";

export function makeGetLowStockProductsUseCase() {
  const productsRepository = new PrismaProductsRepository();
  return new GetLowStockProductsUseCase(productsRepository);
}
