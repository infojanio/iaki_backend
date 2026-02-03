import { Prisma, Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

/* ==============================
   🧱 MODELOS AUXILIARES
============================== */

export interface ProductWithNames {
  id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  quantity: Prisma.Decimal;
  image: string | null;
  status: boolean;
  cashback_percentage: number;
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
  findByStoreId(store_id: string): Promise<Product[]>;
  findByStoreIdActive(store_id: string): Promise<Product[]>;

  /* ========= SUBCATEGORIA + LOJA (OBRIGATÓRIO) ========= */
  findBySubCategoryAndStore(
    subcategory_id: string,
    store_id: string,
  ): Promise<Product[]>;

  listMany(): Promise<Product[]>; // listar todos
  /* ========= HOME / DESTAQUES ========= */
  listManyProductActive(): Promise<Product[]>;
  listManyProductActiveByCity(cityId: string): Promise<Product[]>;

  findByCashback(): Promise<Product[]>; // destaque (Home)
  findByQuantity(): Promise<Product[]>; // baixo estoque (Home)

  /* ========= BUSCA ========= */
  searchMany(search: string, page: number): Promise<Product[]>;

  searchByName(
    query: string,
    page: number,
    pageSize?: number,
  ): Promise<[Product[], number]>;

  /* ========= ESTOQUE ========= */
  getProductStock(productId: string): Promise<number | Decimal>;

  getProductStockDetails(
    productId: string,
  ): Promise<{ quantity: number; name: string }>;

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
      cashback_percentage?: number;
      store_id?: string;
      subcategory_id?: string;
    },
  ): Promise<Product>;

  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product>;
}
