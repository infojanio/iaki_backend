import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { ListPremiumReelsByCityUseCase } from "../reels/list-premium-reels-by-city";

export function makeListPremiumReelsByCityUseCase() {
  const reelsRepository = new PrismaReelsRepository();

  return new ListPremiumReelsByCityUseCase(reelsRepository);
}
