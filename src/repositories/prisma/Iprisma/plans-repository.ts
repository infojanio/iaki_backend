import { Plan, Prisma } from "@prisma/client";

export interface PlansRepository {
  create(data: Prisma.PlanUncheckedCreateInput): Promise<Plan>;
  findById(id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  list(): Promise<Plan[]>;
  update(id: string, data: Prisma.PlanUpdateInput): Promise<Plan>;
  delete(id: string): Promise<void>;
  countSubscriptionsByPlanId(planId: string): Promise<number>;
}
