import { prisma } from "@/lib/prisma";
import { BusinessCategoryCityRepository } from "./Iprisma/business-category-city-repository";

export class PrismaBusinessCategoryCityRepository
  implements BusinessCategoryCityRepository
{
  async create({ businessCategoryId, cityId }: any) {
    await prisma.businessCategoryCity.create({
      data: { businessCategoryId, cityId },
    });
  }

  async findByCity(cityId: string) {
    const records = await prisma.businessCategoryCity.findMany({
      where: {
        cityId,
      },
      select: {
        businessCategory: true,
      },
    });

    return records.map((item) => item.businessCategory);
  }

  async findByCityAndCategory({
    cityId,
    categoryId,
  }: {
    cityId: string;
    categoryId: string;
  }) {
    return prisma.store.findMany({
      where: {
        cityId,
        businessCategories: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        businessCategories: false,
      },
    });
  }

  async delete({ businessCategoryId, cityId }: any) {
    await prisma.businessCategoryCity.delete({
      where: {
        businessCategoryId_cityId: {
          businessCategoryId,
          cityId,
        },
      },
    });
  }
}
