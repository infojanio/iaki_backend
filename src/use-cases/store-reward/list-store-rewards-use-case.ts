import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

interface Request {
  storeId: string;
}

export class ListStoreRewardsUseCase {
  constructor(private storeRewardsRepository: StoreRewardsRepository) {}

  async execute({ storeId }: Request) {
    const rewards = await this.storeRewardsRepository.findByStoreId(storeId);

    return {
      rewards,
    };
  }
}
