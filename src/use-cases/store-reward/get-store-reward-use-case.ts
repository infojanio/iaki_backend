import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

interface Request {
  rewardId: string;
}

export class GetStoreRewardUseCase {
  constructor(private storeRewardsRepository: StoreRewardsRepository) {}

  async execute({ rewardId }: Request) {
    const reward = await this.storeRewardsRepository.findById(rewardId);

    if (!reward) {
      throw new ResourceNotFoundError();
    }

    return {
      reward,
    };
  }
}
