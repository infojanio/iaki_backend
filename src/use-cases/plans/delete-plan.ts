import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { PlanHasSubscriptionsError } from "@/utils/messages/errors/plan-has-subscriptions-error";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

interface DeletePlanUseCaseRequest {
  id: string;
}

export class DeletePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({ id }: DeletePlanUseCaseRequest): Promise<void> {
    const existingPlan = await this.plansRepository.findById(id);

    if (!existingPlan) {
      throw new PlanNotFoundError();
    }

    const subscriptionsCount =
      await this.plansRepository.countSubscriptionsByPlanId(id);

    if (subscriptionsCount > 0) {
      throw new PlanHasSubscriptionsError();
    }

    await this.plansRepository.delete(id);
  }
}
