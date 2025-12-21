import { Prisma, State } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StatesRepository } from "./Iprisma/states-repository";

export class PrismaStatesRepository implements StatesRepository {
  async findById(id: string): Promise<State | null> {
    return prisma.state.findUnique({
      where: { id },
    });
  }

  async findByUf(uf: string): Promise<State | null> {
    return prisma.state.findUnique({
      where: { uf },
    });
  }

  async findByName(name: string): Promise<State | null> {
    return prisma.state.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findMany(): Promise<State[]> {
    return prisma.state.findMany({
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.StateUncheckedCreateInput): Promise<State> {
    return prisma.state.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      uf?: string;
    },
  ): Promise<State> {
    return prisma.state.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<State> {
    return prisma.state.delete({
      where: { id },
    });
  }
}
