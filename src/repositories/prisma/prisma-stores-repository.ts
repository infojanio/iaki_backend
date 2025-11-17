import { prisma } from "@/lib/prisma";
import { Store, Prisma } from "@prisma/client";
import {
  FindManyNearbyParams,
  StoresRepository,
} from "./Iprisma/stores-repository";
export class PrismaStoresRepository implements StoresRepository {
  //retorna todas as lojas
  async listMany(): Promise<Store[]> {
    const stores = await prisma.store.findMany();
    return stores;
  }

  //retorna lojas ativas
  async listManyActive(): Promise<Store[]> {
    const stores = await prisma.store.findMany({
      where: { isActive: true },
      include: {
        businessCategories: {
          include: {
            category: true,
          },
        },
      },
    });
    return stores;
  }

  async findById(id: string): Promise<Store | null> {
    const store = await prisma.store.findUnique({
      where: {
        id,
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

  async create(data: Prisma.StoreCreateInput) {
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
