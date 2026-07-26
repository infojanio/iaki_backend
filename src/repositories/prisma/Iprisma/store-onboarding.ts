import { Plan, Store, Subscription, User } from "@prisma/client";

export interface StoreOnboardingStoreInput {
  name: string;
  slug?: string | null;
  latitude: number;
  longitude: number;
  phone: string;
  cnpj: string;
  avatar?: string | null;
  street: string;
  postalCode: string;
  cityId: string;
}

export interface StoreOnboardingUserInput {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  passwordHash: string;
  avatar?: string | null;
  street: string;
  state: string;
  postalCode: string;
}

export interface CreateStoreOnboardingInput {
  planName: string;
  store: StoreOnboardingStoreInput;
  user: StoreOnboardingUserInput;
  storeIsActive: boolean;
}

export interface CreateStoreOnboardingResult {
  store: Store;
  user: User;
  plan: Plan;
  subscription: Subscription;
}

export interface StoreOnboardingRepository {
  createStoreOnboarding(
    data: CreateStoreOnboardingInput,
  ): Promise<CreateStoreOnboardingResult>;
}
