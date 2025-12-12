import { Prisma, StoreBusinessCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StoreBusinessCategoryRepository } from "./Iprisma/store-business-category-repository";

export class PrismaStoreBusinessCategoryRepository
  implements StoreBusinessCategoryRepository
{
  async findById(id: string): Promise<StoreBusinessCategory | null> {
    return prisma.storeBusinessCategory.findUnique({
      where: { id },
    });
  }

  async findByStoreId(storeId: string): Promise<StoreBusinessCategory[]> {
    return prisma.storeBusinessCategory.findMany({
      where: { storeId },
    });
  }

  async findByCategoryId(categoryId: string): Promise<StoreBusinessCategory[]> {
    return prisma.storeBusinessCategory.findMany({
      where: { categoryId },
    });
  }

  async findByStoreAndCategory(
    storeId: string,
    categoryId: string,
  ): Promise<StoreBusinessCategory | null> {
    return prisma.storeBusinessCategory.findUnique({
      where: {
        storeId_categoryId: {
          storeId,
          categoryId,
        },
      },
    });
  }

  async findMany(): Promise<StoreBusinessCategory[]> {
    return prisma.storeBusinessCategory.findMany();
  }

  async create(
    data: Prisma.StoreBusinessCategoryUncheckedCreateInput,
  ): Promise<StoreBusinessCategory> {
    return prisma.storeBusinessCategory.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      storeId?: string;
      categoryId?: string;
    },
  ): Promise<StoreBusinessCategory> {
    return prisma.storeBusinessCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<StoreBusinessCategory> {
    return prisma.storeBusinessCategory.delete({
      where: { id },
    });
  }
}
