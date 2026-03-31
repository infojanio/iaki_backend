import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { StoreUsageRepository } from "@/repositories/prisma/Iprisma/store-usage-repository";

type LimitedResource = "products" | "banners" | "reels" | "categories";

interface ValidateDowngradePlanRequest {
  storeId: string;
  newPlanId: string;
}

interface ValidateDowngradePlanResponse {
  allowed: boolean;
  exceeded?: {
    resource: LimitedResource;
    current: number;
    limit: number;
  }[];
}

export class ValidateDowngradePlanUseCase {
  constructor(
    private plansRepository: PlansRepository,
    private storeUsageRepository: StoreUsageRepository,
  ) {}

  async execute({
    storeId,
    newPlanId,
  }: ValidateDowngradePlanRequest): Promise<ValidateDowngradePlanResponse> {
    const plan = await this.plansRepository.findById(newPlanId);

    if (!plan) {
      throw new Error("Plano não encontrado.");
    }

    const [products, banners, reels, categories] = await Promise.all([
      this.storeUsageRepository.countProductsByStoreId(storeId),
      this.storeUsageRepository.countBannersByStoreId(storeId),
      this.storeUsageRepository.countReelsByStoreId(storeId),
      this.storeUsageRepository.countCategoriesByStoreId(storeId),
    ]);

    const exceeded: ValidateDowngradePlanResponse["exceeded"] = [];

    if (plan.maxProducts !== null && products > plan.maxProducts) {
      exceeded.push({
        resource: "products",
        current: products,
        limit: plan.maxProducts,
      });
    }

    if (plan.maxBanners !== null && banners > plan.maxBanners) {
      exceeded.push({
        resource: "banners",
        current: banners,
        limit: plan.maxBanners,
      });
    }

    if (plan.maxReels !== null && reels > plan.maxReels) {
      exceeded.push({
        resource: "reels",
        current: reels,
        limit: plan.maxReels,
      });
    }

    if (plan.maxCategories !== null && categories > plan.maxCategories) {
      exceeded.push({
        resource: "categories",
        current: categories,
        limit: plan.maxCategories,
      });
    }

    if (exceeded.length > 0) {
      return {
        allowed: false,
        exceeded,
      };
    }

    return {
      allowed: true,
    };
  }
}
