import { Prisma, Store, StoreCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { StoreCategoryRepository } from "./Iprisma/store-category-repository";

export class PrismaStoreCategoryRepository implements StoreCategoryRepository {
  findManyStoresByCategoryAndStore(
    categoryId: string,
    storeId: string,
  ): Promise<Store[]> {
    throw new Error("Method not implemented.");
  }

  async findManyByStoreId(storeId: string): Promise<StoreCategory[]> {
    return prisma.storeCategory.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
      },
      orderBy: {
        category: {
          name: "asc",
        },
      },
    });
  }

  async replaceStoreCategories(
    storeId: string,
    categoryIds: string[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.storeCategory.deleteMany({
        where: {
          storeId,
        },
      });

      if (categoryIds.length > 0) {
        await tx.storeCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            storeId,
            categoryId,
          })),
          skipDuplicates: true,
        });
      }
    });
  }

  async findByStoreAndCategory({
    storeId,
    categoryId,
  }: {
    storeId: string;
    categoryId: string;
  }) {
    return prisma.storeCategory.findUnique({
      where: {
        storeId_categoryId: {
          storeId,
          categoryId,
        },
      },
    });
  }

  async findManyStoresByCategoryId(categoryId: string): Promise<Store[]> {
    console.log("🟡 [Repository] categoryId:", categoryId);

    const relations = await prisma.storeCategory.findMany({
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
    const relations = await prisma.storeCategory.findMany({
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

  async findById(id: string): Promise<StoreCategory | null> {
    return prisma.storeCategory.findUnique({
      where: { id },
    });
  }

  async findByStore(storeId: string) {
    const records = await prisma.storeCategory.findMany({
      where: {
        storeId,
      },
      select: {
        store: true,
      },
    });

    return records.map((item) => item.store);
  }

  async findManyByCategoryId(categoryId: string): Promise<Store[]> {
    console.log(
      "🟡 [Repository] Filtrando lojas por tipo de negócio:",
      categoryId,
    );

    const storeCategories = await prisma.store.findMany({
      where: {
        storeCategories: {
          some: {
            categoryId,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    console.log(
      "🟢 [Repository] Tipos de Negócios encontrados:",
      storeCategories,
    );

    return storeCategories;
  }

  async findByCategory({ categoryId, storeId }: any): Promise<Store[]> {
    const records = await prisma.storeCategory.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        store: true,
      },
    });

    return records.map((r) => r.store);
  }

  async findByStoreId(storeId: string): Promise<StoreCategory[]> {
    return prisma.storeCategory.findMany({
      where: { storeId },
    });
  }

  async findByCategoryId(categoryId: string): Promise<StoreCategory[]> {
    return prisma.storeCategory.findMany({
      where: { categoryId },
    });
  }

  async findMany(): Promise<StoreCategory[]> {
    return prisma.storeCategory.findMany();
  }

  async create(
    data: Prisma.StoreCategoryUncheckedCreateInput,
  ): Promise<StoreCategory> {
    return prisma.storeCategory.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      storeId?: string;
      categoryId?: string;
    },
  ): Promise<StoreCategory> {
    return prisma.storeCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<StoreCategory> {
    return prisma.storeCategory.delete({
      where: { id },
    });
  }
}
