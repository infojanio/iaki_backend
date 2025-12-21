import { Product } from "@prisma/client";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface ListProductsByStoreUseCaseRequest {
  storeId: string;
}

interface ListProductsByStoreUseCaseResponse {
  products: Product[];
}

export class ListProductsByStoreUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute({
    storeId,
  }: ListProductsByStoreUseCaseRequest): Promise<ListProductsByStoreUseCaseResponse> {
    // valida se a loja existe
    const storeExists = await this.storesRepository.findById(storeId);

    if (!storeExists || !storeExists.isActive) {
      throw new Error("Loja não encontrada ou inativa");
    }

    const products = await this.productsRepository.findByStoreIdActive(storeId);

    return { products };
  }
}
