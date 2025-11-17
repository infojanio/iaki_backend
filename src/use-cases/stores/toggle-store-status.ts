import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface ToggleStoreStatusRequest {
  storeId: string;
  isActive: boolean;
}

export class ToggleStoreStatusUseCase {
  constructor(private storeRepository: StoresRepository) {}

  async execute({ storeId, isActive }: ToggleStoreStatusRequest) {
    const store = await this.storeRepository.findById(storeId);

    if (!store) {
      throw new ResourceNotFoundError();
    }

    await this.storeRepository.toggleStatus(storeId, isActive);

    return {
      message: `Loja ${isActive ? "ativada" : "desativada"} com sucesso.`,
    };
  }
}
