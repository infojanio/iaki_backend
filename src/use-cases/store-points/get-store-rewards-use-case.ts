import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

interface GetStoreRewardsRequest {
  storeId: string;
}

export class GetStoreRewardsUseCase {
  constructor(private rewardsRepository: StoreRewardsRepository) {}

  async execute({ storeId }: GetStoreRewardsRequest) {
    return this.rewardsRepository.findActiveByStore(storeId);
  }
}
