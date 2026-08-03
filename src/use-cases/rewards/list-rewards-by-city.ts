import { RewardsRepository } from "@/repositories/prisma/Iprisma/rewards-repository";

interface ListRewardsByCityUseCaseRequest {
  cityId: string;
}

export class ListRewardsByCityUseCase {
  constructor(private storeRewardsRepository: RewardsRepository) {}

  async execute({ cityId }: ListRewardsByCityUseCaseRequest) {
    const rewards =
      await this.storeRewardsRepository.findManyAvailableByCity(cityId);

    return {
      rewards,
    };
  }
}
