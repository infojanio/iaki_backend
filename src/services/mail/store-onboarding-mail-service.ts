export interface SendStoreOnboardingConfirmationInput {
  to: string;
  responsibleName: string;
  storeName: string;

  storeStatus: string;
  adminPanelUrl: string;
}

export interface StoreOnboardingMailService {
  sendConfirmation(data: SendStoreOnboardingConfirmationInput): Promise<void>;
}
