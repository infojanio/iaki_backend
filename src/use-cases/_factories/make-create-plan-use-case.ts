import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { CreatePlanUseCase } from "../plans/create-plan";

export function makeCreatePlanUseCase() {
  const plansRepository = new PrismaPlansRepository();
  return new CreatePlanUseCase(plansRepository);
}
