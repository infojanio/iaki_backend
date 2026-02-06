import { prisma } from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";
import { ProductsRepository } from "./Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaProductsRepository implements ProductsRepository {
  /* ==============================
     🆕 CREATE
  ============================== */
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  /* ==============================
     🔍 FINDS BÁSICOS
  ============================== */
  async findByIdProduct(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });
  }

  async findProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findById(
    id: string,
    options?: { select?: Prisma.ProductSelect },
  ): Promise<Product | Partial<Product> | null> {
    return prisma.product.findUnique({
      where: { id },
      select: options?.select,
    });
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: { id: { in: ids } },
    });
  }

  /* ==============================
     🏪 POR LOJA
  ============================== */
  async findByStoreId(store_id: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: { store_id },
      orderBy: { name: "asc" },
    });
  }

  async findByStoreIdActive(store_id: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        store_id,
        status: true,
      },
      orderBy: { name: "asc" },
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  /* ==============================
     🔥 SUBCATEGORIA + LOJA
  ============================== */
  async findBySubCategoryAndStore(
    subcategory_id: string,
    store_id: string,
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        subcategory_id,
        store_id,
      },
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  /* ==============================
     🏙️ CIDADE
  ============================== */
  async listManyProductActiveByCity(cityId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        store: { cityId },
      },
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  async listMany(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      include: { subcategory: { include: { Category: true } } },
    });
    return products;
  }

  /* ==============================
     🏠 HOME / DESTAQUES
  ============================== */
  async listManyProductActive(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { status: true },
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  async findByCashback(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { status: true },
      orderBy: { cashback_percentage: "desc" },
      take: 4,
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  async findByQuantity(): Promise<Product[]> {
    return prisma.product.findMany({
      where: { status: true },
      orderBy: { quantity: "asc" },
      take: 4,
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  /* ==============================
     🔎 BUSCA
  ============================== */
  async searchMany(search: string, page: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        name: { contains: search, mode: "insensitive" },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  async searchByName(
    query: string,
    page: number,
    pageSize = 5,
  ): Promise<[Product[], number]> {
    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          status: true,
          name: { contains: query, mode: "insensitive" },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: {
          subcategory: {
            include: {
              Category: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          status: true,
          name: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return [products, total];
  }

  /* ==============================
     📦 ESTOQUE
  ============================== */
  async getProductStock(productId: string): Promise<number | Decimal> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true },
    });

    if (!product) throw new ResourceNotFoundError();
    return Number(product.quantity);
  }

  async findLowStockByStore(storeId: string) {
    const products = await prisma.product.findMany({
      where: { store_id: storeId },
    });

    return products
      .filter((p) => Number(p.quantity) <= p.minStock)
      .map((p) => ({
        id: p.id,
        name: p.name,
        quantity: Number(p.quantity),
        minStock: p.minStock,
      }));
  }

  async getProductStockDetails(
    productId: string,
  ): Promise<{ quantity: number; name: string }> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true, name: true },
    });

    if (!product) throw new ResourceNotFoundError();

    return {
      quantity: Number(product.quantity),
      name: product.name,
    };
  }

  async updateStockWithTx(
    tx: Prisma.TransactionClient,
    id: string,
    quantity: number,
  ) {
    await tx.product.update({
      where: { id },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }

  async updateStock(
    id: string,
    quantity: number,
    action: "increment" | "decrement" = "decrement",
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        quantity: {
          [action]: Math.abs(quantity),
        },
      },
    });
  }

  async updateQuantity(
    id: string,
    data: { quantity: number; status: boolean },
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  /* ==============================
     🛠️ UPDATE / DELETE
  ============================== */
  async update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    const product = await prisma.product.findUnique({ where });

    if (!product) {
      throw new ResourceNotFoundError();
    }

    return prisma.product.update({
      where,
      data: {
        status: false,
        quantity: 0,
      },
    });
  }
}
