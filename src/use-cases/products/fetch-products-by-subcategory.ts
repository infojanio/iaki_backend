import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { Product, Prisma } from "@prisma/client";
interface FetchProductSubCategoryUseCaseRequest {
  subcategoryId: string;
  storeId: string;
}

export class FetchProductsBySubCategoryUseCase {
  constructor(private productsRepository: ProductsRepository) {}
  async execute({
    subcategoryId,
    storeId,
  }: FetchProductSubCategoryUseCaseRequest): Promise<Product[] | null> {
    const products = await this.productsRepository.findBySubCategoryAndStore(
      subcategoryId,
      storeId,
    );
    return products;
  }
}
