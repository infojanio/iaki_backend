import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";

export class ListSubscriptionsUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute() {
    const subscriptions =
      await this.subscriptionsRepository.listAllWithPlanAndStore();

    const now = new Date();

    return {
      subscriptions: subscriptions.map((subscription) => {
        const daysRemaining = Math.ceil(
          (new Date(subscription.endDate).getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        return {
          id: subscription.id,
          status: subscription.status,
          isTrial: subscription.isTrial,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          createdAt: subscription.createdAt,
          daysRemaining: Math.max(daysRemaining, 0),
          plan: {
            id: subscription.plan.id,
            name: subscription.plan.name,
            price: subscription.plan.price,
            durationDays: subscription.plan.durationDays,
          },
          store: {
            id: subscription.store.id,
            name: subscription.store.name,
            cnpj: subscription.store.cnpj,
            city: subscription.store.city?.name ?? null,
            isActive: subscription.store.isActive,
          },
        };
      }),
    };
  }
}
