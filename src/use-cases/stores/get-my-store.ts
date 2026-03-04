import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";

interface GetMyStoreUseCaseRequest {
  userStoreId: string | null;
}

export class GetMyStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({ userStoreId }: GetMyStoreUseCaseRequest) {
    if (!userStoreId) {
      throw new Error("Usuário não possui loja vinculada.");
    }

    const store = await this.storesRepository.findById(userStoreId);

    if (!store) {
      throw new Error("Loja não encontrada.");
    }

    return { store };
  }
}
