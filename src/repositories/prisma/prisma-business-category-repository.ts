import { Prisma, BusinessCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { BusinessCategoriesRepository } from "./Iprisma/business-category-repository ";

export class PrismaBusinessCategoriesRepository
  implements BusinessCategoriesRepository
{
  async findById(id: string): Promise<BusinessCategory | null> {
    return prisma.businessCategory.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<BusinessCategory | null> {
    return prisma.businessCategory.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findAll(): Promise<BusinessCategory[]> {
    return prisma.businessCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findManyByCityId(cityId: string): Promise<BusinessCategory[]> {
    console.log("🟡 [Repository] Filtrando categorias por cityId:", cityId);

    const categories = await prisma.businessCategory.findMany({
      where: {
        cities: {
          some: {
            cityId,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log("🟢 [Repository] Categorias encontradas:", categories);

    return categories;
  }

  async findMany(): Promise<BusinessCategory[]> {
    return prisma.businessCategory.findMany({
      orderBy: { name: "asc" },
    });
  }

  async search(query: string): Promise<BusinessCategory[]> {
    return prisma.businessCategory.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: { name: "asc" },
    });
  }

  async create(data: { name: string; image?: string }) {
    return prisma.businessCategory.create({
      data: {
        name: data.name,
        image: data.image,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      image?: string | null;
    },
  ): Promise<BusinessCategory> {
    return prisma.businessCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<BusinessCategory> {
    return prisma.businessCategory.delete({
      where: { id },
    });
  }
}
