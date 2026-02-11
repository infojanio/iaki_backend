import { BannersRepository } from "@/repositories/prisma/Iprisma/banners-repository";
import { Banner, Prisma } from "@prisma/client";
interface CreateBannerUseCaseRequest {
  id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  position: number;
  storeId: string;
  createdAt: Date;
}

export class CreateBannerUseCase {
  constructor(private bannersRepository: BannersRepository) {}
  async execute({
    id,
    title,
    imageUrl,
    link,
    position,
    storeId,
    createdAt,
  }: CreateBannerUseCaseRequest) {
    const banner = await this.bannersRepository.create({
      id,
      title,
      imageUrl,
      link,
      position,
      storeId,
      createdAt,
    });
    return {
      banner,
    };
  }
}
