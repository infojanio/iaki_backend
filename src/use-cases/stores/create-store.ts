import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { hash } from "bcryptjs";
import { StoreAlreadyExistsError } from "../../utils/messages/errors/store-already-exists-error";
import { Role, Store } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface RegisterUseCaseRequest {
  id?: string;
  name: string;
  slug: string;
  isActive: boolean;
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
    isActive,
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
      const storeWithSameCnpj = await this.storesRepository.findByCnpj(cnpj);

      if (storeWithSameCnpj) {
        throw new StoreAlreadyExistsError();
      }

      // Cria o usuário
      const store = await this.storesRepository.create({
        id,
        name,
        phone,
        slug,
        isActive,
        latitude,
        longitude,
        cnpj,
        avatar,
        street,
        postalCode,
        cityId,
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
