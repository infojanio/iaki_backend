import {
  StoreRewardRedemptionDetails,
  StoreRewardRedemptionsRepository,
} from "@/repositories/prisma/Iprisma/store-reward-redemptions-repository";

interface GetMyRewardRedemptionRequest {
  redemptionId: string;
  userId: string;
}

interface GetMyRewardRedemptionResponse {
  redemption: StoreRewardRedemptionDetails | null;
}

export class GetMyRewardRedemptionUseCase {
  constructor(
    private storeRewardRedemptionsRepository: StoreRewardRedemptionsRepository,
  ) {}

  async execute({
    redemptionId,
    userId,
  }: GetMyRewardRedemptionRequest): Promise<GetMyRewardRedemptionResponse> {
    const redemption =
      await this.storeRewardRedemptionsRepository.findRedemptionByIdAndUserId(
        redemptionId,
        userId,
      );

    return {
      redemption,
    };
  }
}
