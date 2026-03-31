import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { Store } from "@prisma/client";
import { StoreAlreadyExistsError } from "../../utils/messages/errors/store-already-exists-error";
import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { PrismaSubscriptionsRepository } from "@/repositories/prisma/prisma-subscriptions-repository";
import { SubscribeStoreToPlanUseCase } from "../subscriptions/subscribe-store-to-plan";
import { prisma } from "@/lib/prisma";
import { CreateInitialSubscriptionUseCase } from "../subscriptions/create-initial-subscription";

interface RegisterUseCaseRequest {
  id?: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
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
    isActive,
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
        isActive: true, // 🔥 sempre nasce ativada
      });

      //registro do plano free
      const plansRepository = new PrismaPlansRepository();
      const subscriptionsRepository = new PrismaSubscriptionsRepository(prisma);

      const initialSubscriptionUseCase = new CreateInitialSubscriptionUseCase(
        plansRepository,
        subscriptionsRepository,
      );

      await initialSubscriptionUseCase.execute({
        storeId: store.id,
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
