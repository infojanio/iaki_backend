import { PrismaReelsRepository } from "@/repositories/prisma/prisma-reels-repository";
import { GetReelsByStoreUseCase } from "../reels/get-reels-by-store";

export function makeGetReelsByStoreUseCase() {
  const reelsRepository = new PrismaReelsRepository();
  const useCase = new GetReelsByStoreUseCase(reelsRepository);
  return useCase;
}
