import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { addDays } from "date-fns";

interface Request {
  subscriptionId: string;
}

export class RenewSubscriptionUseCase {
  constructor(private repo: SubscriptionsRepository) {}

  async execute({ subscriptionId }: Request) {
    const sub = await this.repo.findById(subscriptionId);

    if (!sub) {
      throw new Error("Subscription not found");
    }

    const newEndDate = addDays(new Date(), 30);

    return this.repo.update(subscriptionId, {
      endDate: newEndDate,
      status: "ACTIVE",
    });
  }
}
