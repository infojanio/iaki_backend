import { Store } from "@prisma/client";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface ListStoresByCityAndCategoryUseCaseRequest {
  cityId: string;
  categoryId: string;
}

interface ListStoresByCityAndCategoryUseCaseResponse {
  stores: Store[];
}

export class ListStoresByCityAndCategoryUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({
    cityId,
    categoryId,
  }: ListStoresByCityAndCategoryUseCaseRequest): Promise<ListStoresByCityAndCategoryUseCaseResponse> {
    const stores = await this.storesRepository.findManyByCityAndCategory(
      cityId,
      categoryId,
    );

    return { stores };
  }
}
