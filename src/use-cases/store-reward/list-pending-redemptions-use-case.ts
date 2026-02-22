import { StoreRewardRedemptionsRepository } from "@/repositories/prisma/Iprisma/store-reward-redemptions-repository";

export class ListPendingRedemptionsUseCase {
  constructor(
    private redemptionsRepository: StoreRewardRedemptionsRepository,
  ) {}

  async execute(params: { userId: string; storeId: string }) {
    return this.redemptionsRepository.findPendingByUser({
      userId: params.userId,
      storeId: params.storeId,
    });
  }
}
