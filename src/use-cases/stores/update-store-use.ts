import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { Store } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface UpdateStoreUseCaseRequest {
  storeId: string;
  name?: string;
  slug?: string;
  isActive?: boolean;
  latitude?: number;
  longitude?: number;
  phone?: string;
  cnpj?: string;
  avatar?: string;
  street?: string;
  postalCode?: string;
  cityId?: string;
}

interface UpdateStoreUseCaseResponse {
  store: Store;
}

export class UpdateStoreUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({
    storeId,
    latitude,
    longitude,
    ...data
  }: UpdateStoreUseCaseRequest): Promise<UpdateStoreUseCaseResponse> {
    const store = await this.storesRepository.findById(storeId);

    if (!store) {
      throw new Error("Loja não encontrada.");
    }

    const updated = await this.storesRepository.update(storeId, {
      ...data,
      latitude: latitude !== undefined ? new Decimal(latitude) : undefined,
      longitude: longitude !== undefined ? new Decimal(longitude) : undefined,
    });

    return { store: updated };
  }
}
