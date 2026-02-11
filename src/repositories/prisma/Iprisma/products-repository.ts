import { Category, Prisma, Product, Store, SubCategory } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/* ==============================
   🧱 MODELOS AUXILIARES
============================== */

export type ProductWithCategory = Product & {
  store: Store;
  subcategory: SubCategory & {
    category: Category;
  };
};

export interface ProductWithNames {
  id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  quantity: Prisma.Decimal;
  image: string | null;
  status: boolean;
  cashbackPercentage: number;
  subcategoryName: string | null;
  categoryName: string | null;
}

/* ==============================
   📦 REPOSITORY
============================== */

export interface ProductsRepository {
  /* ========= CREATE ========= */
  create(data: Prisma.ProductUncheckedCreateInput): Promise<Product>;

  /* ========= FINDS BÁSICOS ========= */
  findByIdProduct(id: string): Promise<Product | null>;
  findProductById(id: string): Promise<Product | null>;

  findById(
    id: string,
    options?: { select?: Prisma.ProductSelect },
  ): Promise<Product | Partial<Product> | null>;

  findByIds(ids: string[]): Promise<Product[]>;

  /* ========= POR LOJA ========= */
  findByStoreId(storeId: string): Promise<Product[]>;
  findByStoreIdActive(storeId: string): Promise<Product[]>;

  /* ========= SUBCATEGORIA + LOJA (OBRIGATÓRIO) ========= */
  findBySubCategoryAndStore(
    subcategoryId: string,
    storeId: string,
  ): Promise<Product[]>;

  listMany(): Promise<Product[]>; // listar todos
  /* ========= HOME / DESTAQUES ========= */
  listManyProductActive(): Promise<Product[]>;
  listManyProductActiveByCity(cityId: string): Promise<Product[]>;

  findByCashback(cashbackPercentage: number): Promise<Product[]>; // destaque (Home)
  findByQuantity(quantity: number): Promise<Product[]>; // baixo estoque (Home)

  /* ========= BUSCA ========= */
  searchMany(search: string, page: number): Promise<Product[]>;

  searchByName(
    query: string,
    page: number,
    pageSize?: number,
  ): Promise<[ProductWithCategory[], number]>;

  /* ========= ESTOQUE ========= */
  getProductStock(productId: string): Promise<number | Decimal>;

  getProductStockDetails(
    productId: string,
  ): Promise<{ quantity: number; name: string }>;

  findLowStockByStore(
    storeId: string,
  ): Promise<
    { id: string; name: string; quantity: number; minStock: number }[]
  >;

  updateStock(
    id: string,
    quantity: number,
    action?: "increment" | "decrement",
  ): Promise<Product>;

  updateStockWithTx(
    tx: Prisma.TransactionClient,
    id: string,
    quantity: number,
  ): Promise<void>;

  updateQuantity(
    id: string,
    data: { quantity: number; status: boolean },
  ): Promise<Product>;

  /* ========= UPDATE / DELETE ========= */
  update(
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      quantity?:
        | number
        | { increment: number }
        | { decrement: number }
        | { set: number };
      image?: string;
      status?: boolean;
      cashbackPercentage?: number;
      storeId?: string;
      subcategoryId?: string;
    },
  ): Promise<Product>;

  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product>;
}
