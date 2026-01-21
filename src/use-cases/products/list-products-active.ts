import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";

interface ListProductsActiveUseCaseRequest {
  cityId: string;
}

export class ListProductsActiveUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ cityId }: ListProductsActiveUseCaseRequest) {
    const products =
      await this.productsRepository.listManyProductActiveByCity(cityId);
    return products;
  }
}
