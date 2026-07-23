import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";

interface ListPremiumBannersByCityRequest {
  cityId: string;
}

export class ListPremiumBannersByCityUseCase {
  constructor(private bannersRepository: BannersRepository) {}

  async execute({ cityId }: ListPremiumBannersByCityRequest) {
    const banners = await this.bannersRepository.findPremiumByCity(cityId, 4); //limite de banner por carregamento 4

    return {
      banners,
    };
  }
}
