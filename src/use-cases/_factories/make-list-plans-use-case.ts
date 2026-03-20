import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { ListPlansUseCase } from "../plans/list-plans";

export function makeListPlansUseCase() {
  const plansRepository = new PrismaPlansRepository();
  return new ListPlansUseCase(plansRepository);
}
