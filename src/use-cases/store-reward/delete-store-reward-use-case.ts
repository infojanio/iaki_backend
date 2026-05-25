import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

interface Request {
  rewardId: string;
}

export class DeleteStoreRewardUseCase {
  constructor(private storeRewardsRepository: StoreRewardsRepository) {}

  async execute({ rewardId }: Request) {
    await this.storeRewardsRepository.delete(rewardId);
  }
}
