import { StoreCategory, Prisma, Store } from "@prisma/client";

export interface StoreCategoryRepository {
  // Buscar por ID da relação
  findById(id: string): Promise<StoreCategory | null>;

  // Buscar todas as categorias de uma loja
  findByStoreId(storeId: string): Promise<StoreCategory[]>;

  // Buscar todas as lojas de uma categoria
  findByCategoryId(categoryId: string): Promise<StoreCategory[]>;

  findManyStoresByCategoryId(categoryId: string): Promise<Store[]>;

  // Verificar se a relação já existe
  create(data: { storeId: string; categoryId: string }): Promise<StoreCategory>;

  findManyStoresByCategoryAndStore(
    categoryId: string,
    storeId: string,
  ): Promise<Store[]>;

  findByStoreAndCategory(params: {
    storeId: string;
    categoryId: string;
  }): Promise<StoreCategory | null>;

  // Listar todas as relações
  findMany(): Promise<StoreCategory[]>;

  // Criar relação loja ↔ businnessCategory
  create(
    data: Prisma.StoreCategoryUncheckedCreateInput,
  ): Promise<StoreCategory>;

  // Atualizar relação (raramente usado, mas mantido por padrão)
  update(
    id: string,
    data: {
      storeId?: string;
      categoryId?: string;
    },
  ): Promise<StoreCategory>;

  // Deletar relação
  delete(id: string): Promise<StoreCategory>;
}
