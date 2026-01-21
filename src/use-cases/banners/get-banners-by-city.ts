import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

interface GetBannersByCityUseCaseRequest {
  cityId: string;
}

export class GetBannersByCityUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({ cityId }: GetBannersByCityUseCaseRequest) {
    const banners = await this.bannersRepository.findManyByCityId(cityId);

    if (!banners) {
      throw new Error("Banner não encontrado");
    }

    return banners;
  }
}
