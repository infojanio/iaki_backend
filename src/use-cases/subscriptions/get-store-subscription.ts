import { StoreUsageRepository } from "@/repositories/prisma/Iprisma/store-usage-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { ExpiredSubscriptionError } from "@/utils/messages/errors/expired-subscription-error";

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
      await this.subscriptionsRepository.findLatestByStoreId(storeId);

    // console.log("store id:", storeId);

    if (!subscription) {
      throw new ExpiredSubscriptionError();
    }

    if (
      subscription.status === "EXPIRED" ||
      subscription.status === "CANCELED"
    ) {
      throw new ExpiredSubscriptionError();
    }

    const usage =
      await this.subscriptionsRepository.getUsageCountsByStoreId(storeId);

    const isExpired = subscription.endDate < new Date();

    return {
      subscription,
      usage,
      isExpired,
    };
  }
}
