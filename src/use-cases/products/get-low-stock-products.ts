import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";

interface GetLowStockProductsUseCaseRequest {
  storeId: string;
}

export class GetLowStockProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ storeId }: GetLowStockProductsUseCaseRequest) {
    const products = await this.productsRepository.findLowStockByStore(storeId);

    return {
      total: products.length,
      products,
    };
  }
}
