import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

interface Request {
  storeId: string;
}

export class CancelSubscriptionUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({ storeId }: Request) {
    await this.subscriptionsRepository.cancelOpenSubscriptionsByStoreId(
      storeId,
    );
  }
}
