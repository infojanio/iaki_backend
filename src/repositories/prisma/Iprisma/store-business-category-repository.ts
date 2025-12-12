import { StoreBusinessCategory, Prisma } from "@prisma/client";

export interface StoreBusinessCategoryRepository {
  // Buscar por ID da relação
  findById(id: string): Promise<StoreBusinessCategory | null>;

  // Buscar todas as categorias de uma loja
  findByStoreId(storeId: string): Promise<StoreBusinessCategory[]>;

  // Buscar todas as lojas de uma categoria
  findByCategoryId(categoryId: string): Promise<StoreBusinessCategory[]>;

  // Verificar se a relação já existe
  findByStoreAndCategory(
    storeId: string,
    categoryId: string,
  ): Promise<StoreBusinessCategory | null>;

  // Listar todas as relações
  findMany(): Promise<StoreBusinessCategory[]>;

  // Criar relação loja ↔ categoria
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
