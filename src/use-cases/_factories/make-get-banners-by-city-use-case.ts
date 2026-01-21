import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { GetBannersByCityUseCase } from "../banners/get-banners-by-city";
export function makeGetBannersByCityUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new GetBannersByCityUseCase(bannersRepository);
  return useCase;
}
