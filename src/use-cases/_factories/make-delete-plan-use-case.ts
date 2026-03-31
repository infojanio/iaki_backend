import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { DeletePlanUseCase } from "../plans/delete-plan";

export function makeDeletePlanUseCase() {
  const plansRepository = new PrismaPlansRepository();
  const useCase = new DeletePlanUseCase(plansRepository);

  return useCase;
}
