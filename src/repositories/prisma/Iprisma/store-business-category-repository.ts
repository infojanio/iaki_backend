import { StoreBusinessCategory, Prisma, Store } from "@prisma/client";

export interface StoreBusinessCategoryRepository {
  // Buscar por ID da relação
  findById(id: string): Promise<StoreBusinessCategory | null>;

  // Buscar todas as categorias de uma loja
  findByStoreId(storeId: string): Promise<StoreBusinessCategory[]>;

  // Buscar todas as lojas de uma categoria
  findByCategoryId(categoryId: string): Promise<StoreBusinessCategory[]>;

  findManyStoresByCategoryId(categoryId: string): Promise<Store[]>;

  // Verificar se a relação já existe
  findByStoreAndCategory(
    categoryId: string,
    storeId: string,
  ): Promise<StoreBusinessCategory | null>;

  findByCityAndCategory(params: {
    cityId: string;
    businessCategoryId: string;
  }): Promise<any[]>;

  findManyStoresByCategoryAndCity(
    categoryId: string,
    cityId: string,
  ): Promise<Store[]>;

  // Listar todas as relações
  findMany(): Promise<StoreBusinessCategory[]>;

  // Criar relação loja ↔ businnessCategory
  create(
    data: Prisma.StoreBusinessCategoryUncheckedCreateInput,
  ): Promise<StoreBusinessCategory>;

  // Atualizar relação (raramente usado, mas mantido por padrão)
  update(
    id: string,
    data: {
      storeId?: string;
      categoryId?: string;
    },
  ): Promise<StoreBusinessCategory>;

  // Deletar relação
  delete(id: string): Promise<StoreBusinessCategory>;
}
