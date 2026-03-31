import { StoreUsageRepository } from "@/repositories/prisma/Iprisma/store-usage-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

interface Response {
  subscription: any;
  usage: {
    products: number;
    banners: number;
    reels: number;
  };
  isExpired: any;
}

export class GetStoreSubscriptionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private storeUsageRepository: StoreUsageRepository,
  ) {}

  async execute({ storeId }: { storeId: string }): Promise<Response> {
    const subscription =
      await this.subscriptionsRepository.findActiveByStoreId(storeId);

    console.log("store id:", storeId);
    if (!subscription) {
      throw new Error("Assinatura não encontrada.");
    }

    const usage =
      await this.subscriptionsRepository.getUsageCountsByStoreId(storeId);

    const isExpired =
      subscription.endDate < new Date() && subscription.status !== "ACTIVE";

    return {
      subscription,
      usage,
      isExpired,
    };
  }
}
