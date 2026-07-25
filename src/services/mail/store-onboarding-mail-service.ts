export interface SendStoreOnboardingConfirmationInput {
  to: string;
  responsibleName: string;
  storeName: string;
  planName: string;
  storeStatus: string;
  adminPanelUrl: string;
}

export interface StoreOnboardingMailService {
  sendConfirmation(data: SendStoreOnboardingConfirmationInput): Promise<void>;
}
