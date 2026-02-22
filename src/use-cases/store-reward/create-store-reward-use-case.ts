import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";

export class CreateStoreRewardUseCase {
  constructor(private storeRewardsRepository: StoreRewardsRepository) {}

  async execute(data: {
    storeId: string;
    title: string;
    description?: string;
    pointsCost: number;
    stock: number;
    image?: string;
    expiresAt?: Date;
    maxPerUser?: number;
  }) {
    const reward = await this.storeRewardsRepository.create({
      storeId: data.storeId,
      title: data.title,
      description: data.description,
      pointsCost: data.pointsCost,
      stock: data.stock,
      image: data.image,
      expiresAt: data.expiresAt,
      maxPerUser: data.maxPerUser,
    });

    return { reward };
  }
}
