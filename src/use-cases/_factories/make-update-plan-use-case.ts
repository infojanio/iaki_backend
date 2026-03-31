import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { UpdatePlanUseCase } from "../plans/update-plan";

export function makeUpdatePlanUseCase() {
  const plansRepository = new PrismaPlansRepository();
  return new UpdatePlanUseCase(plansRepository);
}
