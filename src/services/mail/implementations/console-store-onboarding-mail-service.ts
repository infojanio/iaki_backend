import {
  SendStoreOnboardingConfirmationInput,
  StoreOnboardingMailService,
} from "../store-onboarding-mail-service";

export class ConsoleStoreOnboardingMailService
  implements StoreOnboardingMailService
{
  async sendConfirmation({
    to,
    responsibleName,
    storeName,
    planName,
    storeStatus,
    adminPanelUrl,
  }: SendStoreOnboardingConfirmationInput): Promise<void> {
    console.log("[StoreOnboardingMailService]", {
      to,
      responsibleName,
      storeName,
      planName,
      storeStatus,
      adminPanelUrl,
    });
  }
}
