import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

interface Request {
  subscriptionId: string;
}

export class CancelSubscriptionUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({ subscriptionId }: Request) {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId);

    if (!subscription) {
      throw new Error("Assinatura não encontrada.");
    }

    await this.subscriptionsRepository.cancelSubscription(subscriptionId);
  }
}
