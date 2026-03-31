import { SubscriptionStatus } from "@prisma/client";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { StoreUsageRepository } from "@/repositories/prisma/Iprisma/store-usage-repository";
import { StoreLimitExceededError } from "@/utils/messages/errors/store-limit-exceeded-error";

type LimitedResource = "products" | "banners" | "reels" | "categories";

interface ValidateStoreLimitsUseCaseRequest {
  storeId: string;
  resource: LimitedResource;
  incrementBy?: number;
}

interface ValidateStoreLimitsUseCaseResponse {
  allowed: boolean;
  current: number;
  limit: number;
  status: SubscriptionStatus | null;
  overLimit: boolean;
  percentage: number;
  reason?: string;
}

export class ValidateStoreLimitsUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private storeUsageRepository: StoreUsageRepository,
  ) {}

  private async getCurrentUsage(
    storeId: string,
    resource: LimitedResource,
  ): Promise<number> {
    switch (resource) {
      case "products":
        return this.storeUsageRepository.countProductsByStoreId(storeId);
      case "banners":
        return this.storeUsageRepository.countBannersByStoreId(storeId);
      case "reels":
        return this.storeUsageRepository.countReelsByStoreId(storeId);
      case "categories":
        return this.storeUsageRepository.countCategoriesByStoreId(storeId);
      default:
        return 0;
    }
  }

  private getLimitFromPlan(
    plan: any,
    resource: LimitedResource,
  ): number | null {
    switch (resource) {
      case "products":
        return plan.maxProducts;
      case "banners":
        return plan.maxBanners;
      case "reels":
        return plan.maxReels;
      case "categories":
        return plan.maxCategories;
      default:
        return null;
    }
  }

  async execute({
    storeId,
    resource,
    incrementBy = 1,
  }: ValidateStoreLimitsUseCaseRequest): Promise<ValidateStoreLimitsUseCaseResponse> {
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
      throw new StoreLimitExceededError("A loja não possui um plano ativo.");
    }

    const now = new Date();

    /**
     * 🔥 Expiração automática
     */
    if (
      latestSubscription.endDate < now &&
      latestSubscription.status !== SubscriptionStatus.EXPIRED &&
      latestSubscription.status !== SubscriptionStatus.CANCELED
    ) {
      await this.subscriptionsRepository.updateStatus(
        latestSubscription.id,
        SubscriptionStatus.EXPIRED,
      );

      throw new StoreLimitExceededError(
        "Sua assinatura expirou. Faça upgrade para continuar.",
      );
    }

    if (
      latestSubscription.status === SubscriptionStatus.EXPIRED ||
      latestSubscription.status === SubscriptionStatus.CANCELED
    ) {
      throw new StoreLimitExceededError("A assinatura não está ativa.");
    }

    const current = await this.getCurrentUsage(storeId, resource);
    const limit = this.getLimitFromPlan(latestSubscription.plan, resource);

    /**
     * 🔥 Plano ilimitado
     */
    if (limit === null) {
      return {
        allowed: true,
        current,
        limit: 0,
        status: latestSubscription.status,
        overLimit: false,
        percentage: 0,
      };
    }

    const nextValue = current + incrementBy;

    /**
     * 🔥 % de uso
     */
    const percentage = limit > 0 ? (current / limit) * 100 : 0;

    /**
     * 🔥 SOFT LIMIT (downgrade)
     */
    if (current > limit) {
      return {
        allowed: false,
        current,
        limit,
        status: latestSubscription.status,
        overLimit: true,
        percentage,
        reason:
          "Você está acima do limite do seu plano. Exclua itens ou faça upgrade.",
      };
    }

    /**
     * 🔥 HARD LIMIT (bloqueio de criação)
     */
    if (nextValue > limit) {
      throw new StoreLimitExceededError(
        `Limite do plano atingido para ${resource}. (${current}/${limit})`,
      );
    }

    return {
      allowed: true,
      current,
      limit,
      status: latestSubscription.status,
      overLimit: false,
      percentage,
    };
  }
}
