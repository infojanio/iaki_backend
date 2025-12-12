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

  async create(
    data: Prisma.BusinessCategoryUncheckedCreateInput,
  ): Promise<BusinessCategory> {
    return prisma.businessCategory.create({
      data,
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
