import { Prisma, Store } from "@prisma/client";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export interface StoreWithCategoriesDTO {
  id: string;
  name: string;
  avatar?: string | null;
  phone?: string | null;
  rating?: number;
  ratingCount?: number;
  cityId: string;
  categories: {
    id: string;
    name: string;
    image?: string | null;
  }[];
}

export interface StoresRepository {
  findById(storeId: string): Promise<Store | null>;
  findManyNearby(params: FindManyNearbyParams): Promise<Store[]>;
  findByCityAndCategory(categoryId: string, cityId: string): Promise<Store[]>;
  findByCity(cityId: string): Promise<Store[]>;

  findManyByBusinessCategoryId(categoryId: string): Promise<Store[]>;

  findByName(name: string): Promise<Store | null>;
  findByCnpj(cnpj: string): Promise<Store | null>;
  create(data: Prisma.StoreUncheckedCreateInput): Promise<Store>;
  searchMany(search: string, page: number): Promise<Store[]>; //buscar por nome
  listMany(): Promise<StoreWithCategoriesDTO[]>; //listar toda
  listManyActive(): Promise<StoreWithCategoriesDTO[]>; //listar todass
  toggleStatus(storeId: string, isActive: boolean): Promise<void>; //alternar loja ativa/inativa
}
