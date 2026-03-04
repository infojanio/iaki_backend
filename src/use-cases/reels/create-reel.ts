import { ReelsRepository } from "@/repositories/prisma/Iprisma/reels-repository";
import { Reel, Prisma } from "@prisma/client";
interface CreateReelUseCaseRequest {
  id?: string;
  title: string;
  image_url: string;
  link?: string;
  created_at: Date;
}

export class CreateReelUseCase {
  constructor(private reelsRepository: ReelsRepository) {}
  async execute({
    id,
    title,
    image_url,
    link,
    created_at,
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
      image_url,
      link,
      created_at,
    });
    return {
      reel,
    };
  }
}
