import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";
import { Reel } from "@prisma/client";

interface GetReelsByStoreUseCaseRequest {
  storeId: string;
}

interface GetReelsByStoreUseCaseResponse {
  reels: Reel[]; // pode tipar melhor depois
}

export class GetReelsByStoreUseCase {
  constructor(private reelsRepository: ReelsRepository) {}

  async execute({
    storeId,
  }: GetReelsByStoreUseCaseRequest): Promise<GetReelsByStoreUseCaseResponse> {
    const reels = await this.reelsRepository.findManyByStoreId(storeId);

    // 🔥 NÃO lança erro se vazio → comportamento correto
    return {
      reels,
    };
  }
}
