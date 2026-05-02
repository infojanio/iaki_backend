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

  /* ==============================
     🔥 LOJAS POR CATEGORIA
  ============================== */
  async findManyStoresByCategoryId(categoryId: string): Promise<Store[]> {
    const relations = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId,
        store: {
          isActive: true,
        },
      },
      include: {
        store: true,
      },
    });

    return relations.map((r) => r.store);
  }

  /* ==============================
     🔥 LOJAS POR CATEGORIA + CIDADE
  ============================== */
  async findManyStoresByCategoryAndCity(
    categoryId: string,
    cityId: string,
  ): Promise<Store[]> {
    const relations = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId,
        store: {
          cityId,
          isActive: true,
        },
      },
      include: {
        store: true,
      },
    });

    return relations.map((r) => r.store);
  }

  /* ==============================
     🔍 BÁSICOS
  ============================== */
  async findById(id: string): Promise<StoreBusinessCategory | null> {
    return prisma.storeBusinessCategory.findUnique({
      where: { id },
    });
  }

  async findByCity(cityId: string) {
    const records = await prisma.businessCategoryCity.findMany({
      where: { cityId },
      select: {
        businessCategory: true,
      },
    });

    return records.map((item) => item.businessCategory);
  }

  /* ==============================
     🔥 LOJAS POR BUSINESS CATEGORY
  ============================== */
  async findManyByBusinessCategoryId(categoryId: string): Promise<Store[]> {
    const stores = await prisma.store.findMany({
      where: {
        isActive: true, // 🔥 AQUI
        storeBusinessCategories: {
          some: {
            categoryId,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return stores;
  }

  async findByBusinessCategory({
    businessCategoryId,
    cityId,
  }: any): Promise<Store[]> {
    const records = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId: businessCategoryId,
        store: {
          isActive: true,
          ...(cityId ? { cityId } : {}),
        },
      },
      select: {
        store: true,
      },
    });

    return records.map((r) => r.store);
  }

  /* ==============================
     🔗 RELAÇÕES
  ============================== */
  async findByStoreId(storeId: string): Promise<StoreBusinessCategory[]> {
    return prisma.storeBusinessCategory.findMany({
      where: { storeId },
    });
  }

  async findByCategoryId(categoryId: string) {
    return prisma.storeBusinessCategory.findMany({
      where: {
        categoryId,
        store: {
          isActive: true, // 🔥 AQUI
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
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

  /* ==============================
     🛠️ CRUD
  ============================== */
  async create(
    data: Prisma.StoreBusinessCategoryUncheckedCreateInput,
  ): Promise<StoreBusinessCategory> {
    return prisma.storeBusinessCategory.create({ data });
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
