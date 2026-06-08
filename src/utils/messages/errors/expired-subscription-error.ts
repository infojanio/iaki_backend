// expired-subscription-error.ts

export class ExpiredSubscriptionError extends Error {
  constructor() {
    super("Sua assinatura está vencida.");
    this.name = "ExpiredSubscriptionError";
  }
}
