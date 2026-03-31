import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";
import { Banner, Prisma } from "@prisma/client";
interface CreateBannerUseCaseRequest {
  id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  position?: number;
  storeId: string;
  createdAt: Date;
}

export class CreateBannerUseCase {
  constructor(private bannersRepository: BannersRepository) {}
  async execute({
    title,
    imageUrl,
    link,
    position,
    storeId,
  }: CreateBannerUseCaseRequest) {
    /* verifica se a loja tem plano ativo
    const store = await storesRepository.findById(user.storeId);

    if (!store.planId) {
      throw new Error("Loja sem plano ativo.");
    }

    const plan = await plansRepository.findById(store.planId);

    const bannerCount = await bannersRepository.countByStore(store.id);

    if (bannerCount >= plan.maxBanners) {
      throw new Error("Limite de banners atingido para o plano atual.");
    }

    */

    const banner = await this.bannersRepository.create({
      title,
      imageUrl,
      link,
      position,
      storeId,
    });
    return {
      banner,
    };
  }
}
