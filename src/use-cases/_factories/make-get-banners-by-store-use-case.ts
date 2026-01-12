import { PrismaBannersRepository } from "@/repositories/prisma/prisma-banners-repository";
import { GetBannersByStoreUseCase } from "../banners/get-banners-by-store";
export function makeGetBannersByStoreUseCase() {
  const bannersRepository = new PrismaBannersRepository();
  const useCase = new GetBannersByStoreUseCase(bannersRepository);
  return useCase;
}
