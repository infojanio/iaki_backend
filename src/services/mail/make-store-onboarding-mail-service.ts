import { ConsoleStoreOnboardingMailService } from "./implementations/console-store-onboarding-mail-service";
import { StoreOnboardingMailService } from "./store-onboarding-mail-service";

export function makeStoreOnboardingMailService(): StoreOnboardingMailService {
  return new ConsoleStoreOnboardingMailService();
}
