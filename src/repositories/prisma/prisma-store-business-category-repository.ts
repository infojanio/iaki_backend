import { Prisma, Store, StoreBusinessCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StoreBusinessCategoryRepository } from "./Iprisma/store-business-category-repository";

export class PrismaStoreBusinessCategoryRepository
  implements StoreBusinessCategoryRepository
{
  findByCityAndCategory(params: {
    cityId: string;
    businessCategoryId: string;
  }): Promise<any[]> {
    throw new Error("Method not implemented.");
  }

  async findManyStoresByCategoryId(categoryId: string): Promise<Store[]> {
    console.log("🟡 [Repository] categoryId:", categoryId);

    const relations = await prisma.storeBusinessCategory.findMany({
      where: { categoryId },
      include: { store: true },
    });

    const stores = relations.map((r) => r.store);

    console.log("🟢 [Repository] lojas encontradas:", stores.length);

    return stores;
  }

  async findManyStoresByCategoryAndCity(
    categoryId: string,
    cityId: string,
  ): Promise<Store[]> {
    const relations = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId,
        store: {
          cityId,
        },
      },
      include: {
        store: true,
      },
    });

    return relations.map((r) => r.store);
  }

  async findById(id: string): Promise<StoreBusinessCategory | null> {
    return prisma.storeBusinessCategory.findUnique({
      where: { id },
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

  async findManyByBusinessCategoryId(categoryId: string): Promise<Store[]> {
    console.log(
      "🟡 [Repository] Filtrando lojas por tipo de negócio:",
      categoryId,
    );

    const businessCategories = await prisma.store.findMany({
      where: {
        storeBusinessCategories: {
          some: {
            categoryId,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log(
      "🟢 [Repository] Tipos de Negócios encontrados:",
      businessCategories,
    );

    return businessCategories;
  }

  async findByBusinessCategory({
    businessCategoryId,
    cityId,
  }: any): Promise<Store[]> {
    const records = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId: businessCategoryId,
        ...(cityId ? { store: { cityId } } : {}),
      },
      select: {
        store: true,
      },
    });

    return records.map((r) => r.store);
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
