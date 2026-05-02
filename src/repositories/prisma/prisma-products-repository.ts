import { prisma } from "@/lib/prisma";
import { Product, Prisma, PrismaClient } from "@prisma/client";
import {
  ProductsRepository,
  ProductWithCategory,
} from "./Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaClient) {}
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
      where: {
        id,
        store: {
          isActive: true,
        },
      },
      include: { store: true },
    });
  }

  async findProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: {
        id,
        store: {
          isActive: true,
        },
      },
    });
  }

  async countByStoreId(storeId: string): Promise<number> {
    return this.prisma.product.count({
      where: {
        storeId,
        status: true,
        store: {
          isActive: true,
        },
      },
    });
  }

  async findById(
    id: string,
    options?: { select?: Prisma.ProductSelect },
  ): Promise<Product | Partial<Product> | null> {
    return prisma.product.findUnique({
      where: {
        id,
        store: {
          isActive: true,
        },
      },
      select: options?.select,
    });
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { in: ids },
        store: {
          isActive: true,
        },
      },
    });
  }

  /* ==============================
     🏪 POR LOJA
  ============================== */
  async findByStoreId(storeId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        storeId,
        store: {
          isActive: true,
        },
      },

      orderBy: { name: "asc" },
    });
  }

  async findByStoreIdActive(storeId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        storeId,
        store: {
          isActive: true,
        },
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
    subcategoryId: string,
    storeId: string,
  ): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        subcategoryId,
        storeId,
        store: {
          isActive: true,
        },
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
        store: { cityId, isActive: true },
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
      where: {
        store: {
          isActive: true,
        },
      },
      include: { subcategory: { include: { category: true } } },
    });
    return products;
  }

  /* ==============================
     🏠 HOME / DESTAQUES
  ============================== */
  async listManyProductActive(): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        store: {
          isActive: true,
        },
      },
      include: {
        store: {
          select: { id: true, name: true, cityId: true },
        },
      },
    });
  }

  async findByCashback(): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        status: true,
        store: {
          isActive: true,
        },
      },
      orderBy: { cashbackPercentage: "desc" },
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
      where: {
        status: true,
        store: {
          isActive: true,
        },
      },
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
        store: {
          isActive: true,
        },
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
    pageSize = 10,
  ): Promise<[ProductWithCategory[], number]> {
    const skip = (page - 1) * pageSize;

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          status: true,
          store: {
            isActive: true,
          },
        },
        include: {
          store: true, // 🔥 OBRIGATÓRIO
          subcategory: {
            include: {
              category: true, // 🔥 OBRIGATÓRIO
            },
          },
        },
        skip,
        take: pageSize,
      }),

      this.prisma.product.count({
        where: {
          name: {
            contains: query,
            mode: "insensitive",
          },
          status: true,
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
      where: {
        id: productId,
        store: {
          isActive: true,
        },
      },
      select: { quantity: true },
    });

    if (!product) throw new ResourceNotFoundError();
    return Number(product.quantity);
  }

  async findLowStockByStore(storeId: string) {
    const products = await prisma.product.findMany({
      where: {
        storeId: storeId,
        store: {
          isActive: true,
        },
      },
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
