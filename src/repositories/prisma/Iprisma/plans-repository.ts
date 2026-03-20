import { Plan, Prisma } from "@prisma/client";

export interface PlansRepository {
  create(data: Prisma.PlanUncheckedCreateInput): Promise<Plan>;
  findById(id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  list(): Promise<Plan[]>;
}
