import { PrismaStoreOnboardingRepository } from "@/repositories/prisma/prisma-store-onboarding-repository";
import { makeStoreOnboardingMailService } from "@/services/mail/make-store-onboarding-mail-service";
import { CreateStoreOnboardingUseCase } from "@/use-cases/store-onboarding/create";

export function makeCreateStoreOnboardingUseCase() {
  return new CreateStoreOnboardingUseCase(
    new PrismaStoreOnboardingRepository(),
    makeStoreOnboardingMailService(),
  );
}
