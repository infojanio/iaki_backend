import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface FetchStoreByIdUseCaseRequest {
  storeId: string;
}

export class FetchStoreByIdUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({ storeId }: FetchStoreByIdUseCaseRequest) {
    if (!storeId) {
      throw new Error("storeId is required");
    }

    const store = await this.storesRepository.findById(storeId);

    return { store };
  }
}
