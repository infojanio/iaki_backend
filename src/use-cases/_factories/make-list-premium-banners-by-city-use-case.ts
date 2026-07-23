import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { ListPremiumBannersByCityUseCase } from "../banners/list-premium-banners-by-city";

export function makeListPremiumBannersByCityUseCase() {
  const bannersRepository = new PrismaBannersRepository();

  return new ListPremiumBannersByCityUseCase(bannersRepository);
}
