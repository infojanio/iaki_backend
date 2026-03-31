import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

interface GetBannersByStoreUseCaseRequest {
  storeId: string;
}

interface GetBannersByStoreUseCaseResponse {
  banners: any[]; // pode tipar melhor depois
}

export class GetBannersByStoreUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({
    storeId,
  }: GetBannersByStoreUseCaseRequest): Promise<GetBannersByStoreUseCaseResponse> {
    const banners = await this.bannersRepository.findManyByStoreId(storeId);

    // 🔥 NÃO lança erro se vazio → comportamento correto
    return {
      banners,
    };
  }
}
