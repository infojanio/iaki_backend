import { prisma } from "@/lib/prisma";
import { Product, Prisma } from "@prisma/client";
import { ProductsRepository } from "./Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    //fazer verificação para não cadastrar o mesmo produto

    const product = await prisma.product.create({
      data,
    });
    console.log("📦 Dados recebidos para criar produto:", data); // 🛠️ Log antes de criar
    return product;
  }

  async findByIdProduct(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        store: true,
      },
    });
    return product;
  }

  async findById(
    id: string,
    options?: { select?: Prisma.ProductSelect },
  ): Promise<Product | Partial<Product> | null> {
    return prisma.product.findUnique({
      where: { id },
      select: options?.select, // Passa o select se existir
    });
  }

  async findProductById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { in: ids }, // Busca produtos cujos IDs estão na lista
      },
    });
  }

  async findByStoreId(store_id: string): Promise<Product[] | null> {
    const product = await prisma.product.findMany({
      where: {
        store_id,
      },
      orderBy: {
        name: "asc",
      },
    });
    return product;
  }

  async findByStoreIdActive(store_id: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        store_id,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async findBySubcategoryId(subcategory_id: string): Promise<Product[] | null> {
    const product = await prisma.product.findMany({
      where: {
        subcategory_id,
      },
    });
    return product;
  }

  async getProductStock(productId: string): Promise<number | Decimal> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true },
    });

    if (!product) {
      throw new ResourceNotFoundError();
    }

    return Number(product.quantity); // Converte Decimal para número
  }

  async getProductStockDetails(
    productId: string,
  ): Promise<{ quantity: number; name: string }> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { quantity: true, name: true },
    });

    if (!product) {
      throw new ResourceNotFoundError();
    }

    return {
      quantity: Number(product.quantity),
      name: product.name,
    };
  }

  async updateStock(
    id: string,
    quantity: number,
    action: "increment" | "decrement" = "decrement",
  ): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: {
        quantity: {
          [action]: Math.abs(quantity), // Garante valor positivo
        },
      },
    });
  }

  async listMany(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      include: {
        subcategory: {
          include: {
            Category: true,
          },
        },
      },
    });

    return products;
  }

  async listManyProductActive(): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        status: true,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async listManyProductActiveByCity(cityId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        status: true,
        store: {
          cityId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async findByCashback() {
    const products = await prisma.product.findMany({
      where: {
        status: true,
      },
      orderBy: {
        cashback_percentage: "desc",
      },
      take: 4,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async findByQuantity() {
    const products = await prisma.product.findMany({
      where: {
        status: true,
      },
      orderBy: {
        quantity: "asc",
      },
      take: 4,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async findBySubCategory(subcategoryId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        status: true,
        subcategory_id: subcategoryId,
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async searchMany(search: string, page: number): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        status: true,
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      take: 20,
      skip: (page - 1) * 20,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            cityId: true,
          },
        },
      },
    });

    return products;
  }

  async updateQuantity(
    id: string,
    data: { quantity: number; status: boolean },
  ) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async update(
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
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        quantity: data.quantity, // O Prisma entenderá automaticamente increment/decrement/set
      },
    });
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    const product = await prisma.product.findUnique({ where });

    if (!product) {
      throw new Error("Product not found");
    }

    return prisma.product.update({
      where,
      data: { status: false, quantity: 0 }, // Marca como "deletado"
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
          name: { contains: query, mode: "insensitive" },
          //status: true,
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
          name: { contains: query, mode: "insensitive" },
          // status: true,
        },
      }),
    ]);

    return [products, total];
  }
}
