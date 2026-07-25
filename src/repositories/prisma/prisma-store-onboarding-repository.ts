import { prisma } from "@/lib/prisma";

import { CityNotFoundError } from "@/utils/messages/errors/city-not-found-error";
import { CpdfAlreadyExistsError } from "@/utils/messages/errors/cpf-already-exists-error copy";
import { StoreAlreadyExistsError } from "@/utils/messages/errors/store-already-exists-error";
import { UserAlreadyExistsError } from "@/utils/messages/errors/user-already-exists-error";

import {
  CreateStoreOnboardingInput,
  CreateStoreOnboardingResult,
  StoreOnboardingRepository,
} from "./Iprisma/store-onboarding";

function normalizeComparable(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export class PrismaStoreOnboardingRepository
  implements StoreOnboardingRepository
{
  async createStoreOnboarding(
    data: CreateStoreOnboardingInput,
  ): Promise<CreateStoreOnboardingResult> {
    return prisma.$transaction(async (tx) => {
      const city = await tx.city.findUnique({
        where: { id: data.store.cityId },
      });
      if (!city) throw new CityNotFoundError();

      const existingStore = await tx.store.findFirst({
        where: { cnpj: data.store.cnpj },
        select: { id: true },
      });
      if (existingStore) throw new StoreAlreadyExistsError();

      const existingEmail = await tx.user.findUnique({
        where: { email: data.user.email },
        select: { id: true },
      });
      if (existingEmail) throw new UserAlreadyExistsError();

      const existingCpf = await tx.user.findFirst({
        where: { cpf: data.user.cpf },
        select: { id: true },
      });
      if (existingCpf) throw new CpdfAlreadyExistsError();

      const store = await tx.store.create({
        data: {
          name: data.store.name,
          slug: data.store.slug ?? null,
          latitude: data.store.latitude,
          longitude: data.store.longitude,
          phone: data.store.phone,
          cnpj: data.store.cnpj,
          avatar: data.store.avatar ?? null,
          street: data.store.street,
          postalCode: data.store.postalCode,
          cityId: data.store.cityId,
          isActive: data.storeIsActive,
        },
      });

      const user = await tx.user.create({
        data: {
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          cpf: data.user.cpf,
          passwordHash: data.user.passwordHash,
          avatar: data.user.avatar ?? null,
          street: data.user.street,
          state: data.user.state,
          postalCode: data.user.postalCode,
          role: "ADMIN",
          storeId: store.id,
        },
      });

      return { store, user };
    });
  }
}
