import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

export class ListStoresActiveUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute() {
    const stores = await this.storesRepository.listManyActive();
    return stores;
  }
}
