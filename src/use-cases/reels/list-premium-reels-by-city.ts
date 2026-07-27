import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";

interface ListPremiumReelsByCityRequest {
  cityId: string;
}

export class ListPremiumReelsByCityUseCase {
  constructor(private reelsRepository: ReelsRepository) {}

  async execute({ cityId }: ListPremiumReelsByCityRequest) {
    const reels = await this.reelsRepository.findPremiumByCity(cityId, 4); //limite de reel por carregamento 4

    return {
      reels,
    };
  }
}
