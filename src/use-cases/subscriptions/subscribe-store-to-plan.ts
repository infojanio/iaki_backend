import { Subscription, SubscriptionStatus } from "@prisma/client";
import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

interface SubscribeStoreToPlanUseCaseRequest {
  storeId: string;
  planId: string;
  isTrial?: boolean;
  customDurationDays?: number;
}

interface SubscribeStoreToPlanUseCaseResponse {
  subscription: Subscription;
}

export class SubscribeStoreToPlanUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private plansRepository: PlansRepository,
  ) {}

  async execute({
    storeId,
    planId,
    isTrial = false,
    customDurationDays,
  }: SubscribeStoreToPlanUseCaseRequest): Promise<SubscribeStoreToPlanUseCaseResponse> {
    const plan = await this.plansRepository.findById(planId);

    if (!plan) {
      throw new PlanNotFoundError();
    }

    await this.subscriptionsRepository.cancelOpenSubscriptionsByStoreId(
      storeId,
    );

    const startDate = new Date();
    const durationDays = customDurationDays ?? plan.durationDays;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    const subscription = await this.subscriptionsRepository.create({
      storeId,
      planId,
      status: isTrial ? SubscriptionStatus.TRIALING : SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      isTrial,
    });

    return { subscription };
  }
}
