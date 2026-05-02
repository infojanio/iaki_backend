import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface Request {
  subscriptionId: string;
  endDate: Date;
  storeId: string;
}

export class UpdateSubscriptionEndDateUseCase {
  constructor(private repo: SubscriptionsRepository) {}

  async execute({ subscriptionId, endDate, storeId }: Request) {
    const subscription = await this.repo.findActiveByStoreId(subscriptionId);

    if (!subscription) {
      throw new ResourceNotFoundError();
    }

    // 🔐 proteção multi-tenant
    if (subscription.storeId !== storeId) {
      throw new Error("Acesso negado a esta assinatura.");
    }

    const updated = await this.repo.update(subscriptionId, {
      endDate,
    });

    return updated;
  }
}
