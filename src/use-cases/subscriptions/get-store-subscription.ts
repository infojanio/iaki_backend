import { SubscriptionStatus } from "@prisma/client";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { StoreUsageRepository } from "@/repositories/prisma/Iprisma/store-usage-repository";

interface GetStoreSubscriptionUseCaseRequest {
  storeId: string;
}

interface LimitUsage {
  used: number;
  limit: number | null;
  available: number | null;
}

interface GetStoreSubscriptionUseCaseResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
    isTrial: boolean;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    plan: {
      id: string;
      name: string;
      price: unknown;
      durationDays: number;
      maxProducts: number | null;
      maxBanners: number | null;
      maxReels: number | null;
      maxCategories: number | null;
      isActive: boolean;
    };
  } | null;
  usage: {
    products: LimitUsage;
    banners: LimitUsage;
    reels: LimitUsage;
    categories: LimitUsage;
  } | null;
}

export class GetStoreSubscriptionUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private storeUsageRepository: StoreUsageRepository,
  ) {}

  async execute({
    storeId,
  }: GetStoreSubscriptionUseCaseRequest): Promise<GetStoreSubscriptionUseCaseResponse> {
    const activeSubscription =
      await this.subscriptionsRepository.findActiveByStoreId(storeId);

    const latestSubscription =
      activeSubscription ??
      (await this.subscriptionsRepository.findLatestByStoreId(storeId));

    if (
      !latestSubscription ||
      !("plan" in latestSubscription) ||
      !latestSubscription.plan
    ) {
      return {
        subscription: null,
        usage: null,
      };
    }

    const now = new Date();

    if (
      latestSubscription.endDate < now &&
      latestSubscription.status !== SubscriptionStatus.EXPIRED &&
      latestSubscription.status !== SubscriptionStatus.CANCELED
    ) {
      await this.subscriptionsRepository.updateStatus(
        latestSubscription.id,
        SubscriptionStatus.EXPIRED,
      );

      latestSubscription.status = SubscriptionStatus.EXPIRED;
    }

    const [productsUsed, bannersUsed, reelsUsed, categoriesUsed] =
      await Promise.all([
        this.storeUsageRepository.countProductsByStoreId(storeId),
        this.storeUsageRepository.countBannersByStoreId(storeId),
        this.storeUsageRepository.countReelsByStoreId(storeId),
        this.storeUsageRepository.countCategoriesByStoreId(storeId),
      ]);

    const makeUsage = (used: number, limit: number | null) => ({
      used,
      limit,
      available: limit === null ? null : Math.max(limit - used, 0),
    });

    return {
      subscription: {
        id: latestSubscription.id,
        status: latestSubscription.status,
        isTrial: latestSubscription.isTrial,
        startDate: latestSubscription.startDate,
        endDate: latestSubscription.endDate,
        createdAt: latestSubscription.createdAt,
        plan: {
          id: latestSubscription.plan.id,
          name: latestSubscription.plan.name,
          price: latestSubscription.plan.price,
          durationDays: latestSubscription.plan.durationDays,
          maxProducts: latestSubscription.plan.maxProducts,
          maxBanners: latestSubscription.plan.maxBanners,
          maxReels: latestSubscription.plan.maxReels,
          maxCategories: latestSubscription.plan.maxCategories,
          isActive: latestSubscription.plan.isActive,
        },
      },
      usage: {
        products: makeUsage(productsUsed, latestSubscription.plan.maxProducts),
        banners: makeUsage(bannersUsed, latestSubscription.plan.maxBanners),
        reels: makeUsage(reelsUsed, latestSubscription.plan.maxReels),
        categories: makeUsage(
          categoriesUsed,
          latestSubscription.plan.maxCategories,
        ),
      },
    };
  }
}
