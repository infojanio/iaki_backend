import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";
import { Reel, Prisma } from "@prisma/client";
interface CreateReelUseCaseRequest {
  id?: string;
  title: string;
  imageUrl: string;
  link?: string;
  storeId: string;
  createdAt: Date;
}

export class CreateReelUseCase {
  constructor(private reelsRepository: ReelsRepository) {}
  async execute({
    id,
    title,
    imageUrl,
    link,
    storeId,
    createdAt,
  }: CreateReelUseCaseRequest) {
    /* verifica se a loja tem plano ativo
    const store = await storesRepository.findById(user.storeId);

    if (!store.planId) {
      throw new Error("Loja sem plano ativo.");
    }

    const plan = await plansRepository.findById(store.planId);

    const reelsCount = await reelsRepository.countByStore(store.id);

    if (reelsCount >= plan.maxReels) {
      throw new Error("Limite de reels atingido para o plano atual.");
    }

    */

    const reel = await this.reelsRepository.create({
      id,
      title,
      imageUrl,
      link,
      storeId,
      createdAt,
    });
    return {
      reel,
    };
  }
}
