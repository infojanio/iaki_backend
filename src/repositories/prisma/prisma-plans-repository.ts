import { prisma } from "@/lib/prisma";
import { Plan, Prisma } from "@prisma/client";

import { PlansRepository } from "./Iprisma/plans-repository";

export class PrismaPlansRepository implements PlansRepository {
  async create(data: Prisma.PlanUncheckedCreateInput): Promise<Plan> {
    return prisma.plan.create({ data });
  }

  async findById(id: string): Promise<Plan | null> {
    return prisma.plan.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Plan | null> {
    return prisma.plan.findUnique({ where: { name } });
  }

  async list(): Promise<Plan[]> {
    return prisma.plan.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}
