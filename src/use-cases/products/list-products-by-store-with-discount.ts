import { Product, DiscountType } from "@prisma/client";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { StoreDiscountRepository } from "@/repositories/prisma/Iprisma/store-discount-repository";

interface ProductWithDiscount extends Product {
  originalPrice: number;
  finalPrice: number;
  discountApplied: number;
  discountType: DiscountType | null;
}

interface ListProductsByStoreWithDiscountUseCaseRequest {
  storeId: string;
}

interface ListProductsByStoreWithDiscountUseCaseResponse {
  products: ProductWithDiscount[];
}

export class ListProductsByStoreWithDiscountUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private storesRepository: StoresRepository,
    private storeDiscountRepository: StoreDiscountRepository,
  ) {}

  async execute({
    storeId,
  }: ListProductsByStoreWithDiscountUseCaseRequest): Promise<ListProductsByStoreWithDiscountUseCaseResponse> {
    const store = await this.storesRepository.findById(storeId);

    if (!store || !store.isActive) {
      throw new Error("Loja não encontrada ou inativa");
    }

    const products = await this.productsRepository.findByStoreIdActive(storeId);

    const discount =
      await this.storeDiscountRepository.findActiveByStoreId(storeId);

    const productsWithDiscount = products.map((product) => {
      let finalPrice = Number(product.price);
      let discountApplied = 0;

      if (discount) {
        discountApplied = Number(discount.value);
        finalPrice = finalPrice - finalPrice * (discountApplied / 100);
      }

      return {
        ...product,
        originalPrice: Number(product.price),
        finalPrice: Number(finalPrice.toFixed(2)),
        discountApplied,
        discountType: discount?.type ?? null,
      };
    });

    return { products: productsWithDiscount };
  }
}
