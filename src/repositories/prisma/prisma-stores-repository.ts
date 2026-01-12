import { prisma } from "@/lib/prisma";
import { Store, Prisma, BusinessCategory } from "@prisma/client";
import {
  FindManyNearbyParams,
  StoresRepository,
  StoreWithCategoriesDTO,
} from "./Iprisma/stores-repository";

export class PrismaStoresRepository implements StoresRepository {
  async findManyByBusinessCategoryId(categoryId: string): Promise<Store[]> {
    console.log(
      "🟡 [Repository] Filtrando stores por businessCategoryId:",
      categoryId,
    );

    const relations = await prisma.storeBusinessCategory.findMany({
      where: {
        categoryId,
      },
      include: {
        store: true,
      },
    });

    const stores = relations.map((rel) => rel.store);

    console.log("🟢 [Repository] Lojas encontradas:", stores);

    return stores;
  }

  async findByCity(cityId: string) {
    const stores = await prisma.store.findMany({
      where: { cityId },
      include: {
        storeCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return stores.map((store) => ({
      ...store,
      categories: store.storeCategories.map((sc) => sc.category),
    }));
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

  //retorna todas as lojas
  async listMany(): Promise<StoreWithCategoriesDTO[]> {
    const stores = await prisma.store.findMany({
      include: {
        storeCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      avatar: store.avatar,
      phone: store.phone,
      isActive: store.isActive,
      latitude: store.latitude,
      longitude: store.longitude,
      cnpj: store.cnpj,
      street: store.street,
      postalCode: store.postalCode,
      cityId: store.cityId,
      rating: store.rating,
      ratingCount: store.ratingCount,

      // 🔑 ESSENCIAL
      categories: store.storeCategories.map((sc) => sc.category),
    }));
  }
  //retorna lojas ativas
  async listManyActive(): Promise<StoreWithCategoriesDTO[]> {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      include: {
        storeCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    return stores.map((store) => ({
      id: store.id,
      name: store.name,
      avatar: store.avatar,
      phone: store.phone,
      rating: store.rating,
      ratingCount: store.ratingCount,
      cityId: store.cityId,
      categories: store.storeCategories.map((sc) => sc.category),
    }));
  }

  async findByCityAndCategory(
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

  async findById(storeId: string): Promise<Store | null> {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        city: true,
        storeCategories: true,
      },
    });
    console.log("Resultado da busca manual:", store);
    return store;
  }

  //busca lojas próximas até 15 km
  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    //$queryRaw -> aceita escrever sql no código
    const stores = await prisma.$queryRaw<Store[]>` 
      SELECT * from stores
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 40 
    `;
    return stores;
  }
  async searchMany(search: string, page: number) {
    const stores = await prisma.store.findMany({
      where: {
        name: {
          contains: search, //verifica se contem a palavra
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return stores;
  }

  //verifica se o email já existe
  async findByName(name: string) {
    const store = await prisma.store.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Torna a busca insensível a maiúsculas/minúsculas
        },
      },
    });
    return store;
  }

  //verifica se o email já existe
  async findByCnpj(cnpj: string) {
    const store = await prisma.store.findFirst({
      where: {
        cnpj: {
          equals: cnpj,
          mode: "insensitive", // Torna a busca insensível a maiúsculas/minúsculas
        },
      },
    });
    return store;
  }

  async create(data: Prisma.StoreUncheckedCreateInput) {
    const store = await prisma.store.create({
      data,
    });
    return store;
  }
  async toggleStatus(storeId: string, isActive: boolean): Promise<void> {
    await prisma.store.update({
      where: { id: storeId },
      data: {
        isActive,
      },
    });
  }
}
