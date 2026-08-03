import { PrismaRewardsRepository } from "@/repositories/prisma/prisma-rewards-repository";
import { ListRewardsByCityUseCase } from "../rewards/list-rewards-by-city";
export function makeListRewardsUseCase() {
  const rewardsRepository = new PrismaRewardsRepository();
  const useCase = new ListRewardsByCityUseCase(rewardsRepository);
  return useCase;
}
