import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface ListPremiumStoresByCity {
  cityId: string;
}

export class ListPremiumStoresByCityUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({ cityId }: ListPremiumStoresByCity) {
    const stores = await this.storesRepository.findPremiumByCity(cityId);

    return {
      stores,
    };
  }
}
