import { Prisma, Store } from "@prisma/client";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface StoresRepository {
  findById(id: string): Promise<Store | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<Store[]>;
  findByCityAndCategory(categoryId: string, cityId: string): Promise<Store[]>;

  findManyByBusinessCategoryId(categoryId: string): Promise<Store[]>;

  findByName(name: string): Promise<Store | null>;
  findByCnpj(cnpj: string): Promise<Store | null>;
  create(data: Prisma.StoreUncheckedCreateInput): Promise<Store>;
  searchMany(search: string, page: number): Promise<Store[]>; //buscar por nome
  listMany(): Promise<Store[]>; //listar toda
  listManyActive(): Promise<Store[]>; //listar todass
  toggleStatus(storeId: string, isActive: boolean): Promise<void>; //alternar loja ativa/inativa
}
