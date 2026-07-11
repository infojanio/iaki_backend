import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { SubscriptionStatus } from "@prisma/client";

interface CreateStoreSubscriptionUseCaseRequest {
  storeId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
}

export class CreateStoreSubscriptionUseCase {
  constructor(
    private storesRepository: StoresRepository,
    private plansRepository: PlansRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    storeId,
    planId,
    status,
    startDate,
    endDate,
  }: CreateStoreSubscriptionUseCaseRequest) {
    const store = await this.storesRepository.findById(storeId);

    if (!store) {
      throw new Error("Loja não encontrada.");
    }

    const plan = await this.plansRepository.findById(planId);

    if (!plan) {
      throw new Error("Plano não encontrado.");
    }

    const finalStartDate = startDate ?? new Date();

    const finalEndDate =
      endDate ??
      new Date(
        finalStartDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
      );

    const subscription =
      await this.subscriptionsRepository.createReplacingOpenSubscriptions({
        storeId,
        planId,
        status,
        startDate: finalStartDate,
        endDate: finalEndDate,
      });

    return {
      subscription,
    };
  }
}
