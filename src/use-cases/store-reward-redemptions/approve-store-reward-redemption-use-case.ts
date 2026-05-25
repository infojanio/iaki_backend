import { StoreRewardRedemptionsRepository } from "@/repositories/prisma/Iprisma/store-reward-redemptions-repository";

interface Request {
  redemptionId: string;
  storeId: string;
}

export class ApproveStoreRewardRedemptionUseCase {
  constructor(private repository: StoreRewardRedemptionsRepository) {}

  async execute({ redemptionId, storeId }: Request) {
    const result = await this.repository.confirmPendingById({
      redemptionId,
      storeId,
      usedAt: new Date(),
    });

    if (result.updatedCount === 0) {
      throw new Error("Solicitação não encontrada.");
    }

    return {
      success: true,
    };
  }
}
