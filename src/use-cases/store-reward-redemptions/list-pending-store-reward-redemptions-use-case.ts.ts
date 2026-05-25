import { StoreRewardRedemptionsRepository } from "@/repositories/prisma/Iprisma/store-reward-redemptions-repository";

interface Request {
  storeId: string;
}

export class ListPendingStoreRewardRedemptionsUseCase {
  constructor(private repository: StoreRewardRedemptionsRepository) {}

  async execute({ storeId }: Request) {
    const redemptions = await this.repository.findPendingByStoreId(storeId);

    return {
      redemptions,
    };
  }
}
