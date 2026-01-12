import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

interface GetBannersByStoreUseCaseRequest {
  storeId: string;
}

export class GetBannersByStoreUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({ storeId }: GetBannersByStoreUseCaseRequest) {
    const banners = await this.bannersRepository.findManyByStoreId(storeId);

    if (!banners) {
      throw new Error("Banner não encontrado");
    }

    return banners;
  }
}
