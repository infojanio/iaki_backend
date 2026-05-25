import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

interface Request {
  rewardId: string;

  title?: string;

  description?: string;

  pointsCost?: number;

  stock?: number;

  image?: string;

  expiresAt?: Date;

  maxPerUser?: number;

  isActive?: boolean;
}

export class UpdateStoreRewardUseCase {
  constructor(private storeRewardsRepository: StoreRewardsRepository) {}

  async execute({ rewardId, ...data }: Request) {
    const reward = await this.storeRewardsRepository.update(rewardId, data);

    return {
      reward,
    };
  }
}
