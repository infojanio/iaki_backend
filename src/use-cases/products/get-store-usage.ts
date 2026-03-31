import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

interface Request {
  storeId: string;
}

export class GetStoreUsageUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({ storeId }: Request) {
    const subscription =
      await this.subscriptionsRepository.findActiveByStoreId(storeId);

    const productsCount = await this.productsRepository.countByStoreId(storeId);

    return {
      usage: {
        products: productsCount,
      },
      limits: {
        maxProducts: subscription?.plan?.maxProducts ?? null,
      },
    };
  }
}
