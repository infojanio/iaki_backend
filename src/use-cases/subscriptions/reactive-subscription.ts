import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

interface Request {
  storeId: string;
}

export class ReactiveSubscriptionUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({ storeId }: Request) {
    await this.subscriptionsRepository.reactiveOpenSubscriptionsByStoreId(
      storeId,
    );
  }
}
