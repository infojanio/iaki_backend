import { StoreRewardRedemptionsRepository } from "@/repositories/prisma/Iprisma/store-reward-redemptions-repository";

interface Request {
  storeId: string;
}

export class ListConfirmedStoreRewardRedemptionsUseCase {
  constructor(private repository: StoreRewardRedemptionsRepository) {}

  async execute({ storeId }: Request) {
    const redemptions = await this.repository.findConfirmedByStoreId(storeId);

    return {
      redemptions,
    };
  }
}
