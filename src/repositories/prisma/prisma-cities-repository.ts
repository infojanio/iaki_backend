import { Prisma, City } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { CitiesRepository } from "./Iprisma/cities-repository";

export class PrismaCitiesRepository implements CitiesRepository {
  async findById(id: string): Promise<City | null> {
    return prisma.city.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<City | null> {
    return prisma.city.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findMany(): Promise<City[]> {
    return prisma.city.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async findManyActive(): Promise<City[]> {
    // Cidade ativa = tem pelo menos 1 loja ativa
    return prisma.city.findMany({
      where: {
        stores: {
          some: {
            isActive: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findByStateId(stateId: string): Promise<City[]> {
    return prisma.city.findMany({
      where: { stateId },
      orderBy: { name: "asc" },
    });
  }

  async search(query: string): Promise<City[]> {
    return prisma.city.findMany({
      where: {
        OR: [{ name: { contains: query, mode: "insensitive" } }],
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: Prisma.CityUncheckedCreateInput): Promise<City> {
    return prisma.city.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      stateId?: string;
    },
  ): Promise<City> {
    return prisma.city.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<City> {
    return prisma.city.delete({
      where: { id },
    });
  }
}
