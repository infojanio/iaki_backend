import { hash } from "bcryptjs";

import { StoreOnboardingMailService } from "@/services/mail/store-onboarding-mail-service";
import { StoreOnboardingRepository } from "@/repositories/prisma/Iprisma/store-onboarding";

interface CreateStoreOnboardingUseCaseRequest {
  store: {
    name: string;
    slug?: string;
    latitude: number;
    longitude: number;
    phone: string;
    cnpj: string;
    avatar?: string;
    street: string;
    postalCode: string;
    cityId: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    password: string;
    avatar?: string;
    street: string;
    state: string;
    postalCode: string;
  };
}

const onlyDigits = (value: string) => value.replace(/\D/g, "");

export class CreateStoreOnboardingUseCase {
  constructor(
    private storeOnboardingRepository: StoreOnboardingRepository,
    private storeOnboardingMailService: StoreOnboardingMailService,
  ) {}

  async execute(request: CreateStoreOnboardingUseCaseRequest) {
    const passwordHash = await hash(request.user.password, 6);

    const result = await this.storeOnboardingRepository.createStoreOnboarding({
      storeIsActive: false,
      store: {
        name: request.store.name.trim(),
        slug: request.store.slug?.trim() || null,
        latitude: request.store.latitude,
        longitude: request.store.longitude,
        phone: onlyDigits(request.store.phone),
        cnpj: onlyDigits(request.store.cnpj),
        avatar: request.store.avatar?.trim() || null,
        street: request.store.street.trim(),
        postalCode: onlyDigits(request.store.postalCode),
        cityId: request.store.cityId,
      },
      user: {
        name: request.user.name.trim(),
        email: request.user.email.trim().toLowerCase(),
        phone: onlyDigits(request.user.phone),
        cpf: onlyDigits(request.user.cpf),
        passwordHash,
        avatar: request.user.avatar?.trim() || null,
        street: request.user.street.trim(),
        state: request.user.state.trim(),
        postalCode: onlyDigits(request.user.postalCode),
      },
    });

    let emailSent = true;
    try {
      await this.storeOnboardingMailService.sendConfirmation({
        to: result.user.email,
        responsibleName: result.user.name,
        storeName: result.store.name,

        storeStatus: result.store.isActive ? "ATIVA" : "AGUARDANDO APROVAÇÃO",
        adminPanelUrl:
          process.env.ADMIN_PANEL_URL ?? "https://painel.iaki.com.br",
      });
    } catch (error) {
      emailSent = false;
      console.error("[StoreOnboarding] Falha ao enviar e-mail:", error);
    }

    return { ...result, emailSent };
  }
}
