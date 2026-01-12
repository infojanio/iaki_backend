import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface ListStoreByCityUseCaseRequest {
  cityId: string;
}

export class ListStoreByCityUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({ cityId }: ListStoreByCityUseCaseRequest) {
    if (!cityId) {
      throw new Error("cityId is required");
    }

    const stores = await this.storesRepository.findByCity(cityId);

    return { stores };
  }
}
