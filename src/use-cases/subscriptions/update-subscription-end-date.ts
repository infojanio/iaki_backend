import { SubscriptionsRepository } from "@/repositories/prisma/Iprisma/subscriptions-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface Request {
  subscriptionId: string;
  endDate: Date;
  //storeId: string;
}
export class UpdateSubscriptionEndDateUseCase {
  constructor(private repo: SubscriptionsRepository) {}

  async execute({ subscriptionId, endDate }: Request) {
    const subscription = await this.repo.findById(subscriptionId);

    if (!subscription) {
      throw new ResourceNotFoundError();
    }

    const normalizedDate = new Date(endDate);

    normalizedDate.setHours(12, 0, 0, 0);

    await this.repo.updateEndDate(subscriptionId, normalizedDate);

    return {
      success: true,
    };
  }
}
