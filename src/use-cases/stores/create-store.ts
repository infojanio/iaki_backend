import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { Store } from "@prisma/client";
import { StoreAlreadyExistsError } from "../../utils/messages/errors/store-already-exists-error";

interface RegisterUseCaseRequest {
  id?: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  phone: string;
  cnpj: string;
  avatar: string;
  street: string;
  postalCode: string;
  cityId: string;
}

interface RegisterUseCaseResponse {
  store: Store;
}

export class RegisterUseCase {
  constructor(private storesRepository: StoresRepository) {}

  async execute({
    id,
    name,
    slug,
    latitude,
    longitude,
    phone,
    cnpj,
    avatar,
    street,
    postalCode,
    cityId,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    try {
      // 🔹 Valida CNPJ duplicado
      const storeWithSameCnpj = await this.storesRepository.findByCnpj(cnpj);
      if (storeWithSameCnpj) {
        throw new StoreAlreadyExistsError();
      }

      const store = await this.storesRepository.create({
        id,
        name,
        slug,
        latitude,
        longitude,
        phone,
        cnpj,
        avatar,
        street,
        postalCode,
        cityId,
        isActive: true, // 🔥 sempre nasce desativada
      });

      return { store };
    } catch (error: any) {
      console.error("[RegisterUseCase]", error);

      if (error instanceof StoreAlreadyExistsError) {
        throw error;
      }

      throw error;
    }
  }
}
