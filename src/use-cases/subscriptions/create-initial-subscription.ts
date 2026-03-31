import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

export class CreateInitialSubscriptionUseCase {
  constructor(
    private plansRepository: PlansRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({ storeId }: { storeId: string }) {
    const freePlan = await this.plansRepository.findByName("FREE");

    if (!freePlan) {
      throw new Error("Plano FREE não encontrado.");
    }

    const startDate = new Date();

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 15);

    await this.subscriptionsRepository.create({
      storeId,
      planId: freePlan.id,
      status: "TRIALING",
      startDate,
      endDate,
    });
  }
}
