import {
  ProductsRepository,
  ProductWithCategory,
} from "@/repositories/prisma/Iprisma/products-repository";

interface SearchProductsUseCaseRequest {
  query: string;
  cityId: string;
  page: number;
  pageSize?: number;
}

interface SearchProductsUseCaseResponse {
  products: ProductWithCategory[];
  total: number;
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    query,
    cityId,
    page,
    pageSize = 24,
  }: SearchProductsUseCaseRequest): Promise<SearchProductsUseCaseResponse> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || !cityId) {
      return {
        products: [],
        total: 0,
      };
    }

    const [products, total] = await this.productsRepository.searchByName(
      trimmedQuery,
      cityId,
      page,
      pageSize,
    );

    return {
      products,
      total,
    };
  }
}
