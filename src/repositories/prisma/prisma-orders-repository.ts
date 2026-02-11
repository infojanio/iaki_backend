import { PrismaClient, OrderStatus, Prisma } from "@prisma/client";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderWithItemsProductsAndStore } from "@/@types/order-with-items-products-and-store";
import { OrderWithItemsAndProducts } from "@/@types/order-with-items";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "@/lib/prisma";

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prismaClient: PrismaClient = prisma) {}

  /**
   * 🔹 Checkout (Cart → Order)
   * 👉 cashbackAmount já deve vir calculado
   */
  async create(data: {
    userId: string;
    storeId: string;
    totalAmount: Decimal;
    discountApplied: Decimal;
    cashbackAmount: Decimal;
    status: OrderStatus;
    items: {
      productId: string;
      quantity: number;
      subtotal: Decimal;
    }[];
  }) {
    return this.prismaClient.order.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        totalAmount: data.totalAmount,
        discountApplied: data.discountApplied,

        status: data.status,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
    });
  }

  /**
   * 🔹 Buscar pedido completo (itens + produtos + store)
   */
  async findById(
    orderId: string,
  ): Promise<OrderWithItemsProductsAndStore | null> {
    return this.prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                cashbackPercentage: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 🔹 Buscar pedido completo (TX)
   * 👉 usado na validação simples
   */
  async findByIdWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<OrderWithItemsProductsAndStore | null> {
    return tx.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                cashbackPercentage: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 🔹 Buscar pedidos do usuário
   */
  async findManyByUserId(
    userId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsProductsAndStore[]> {
    const take = 10;
    const skip = (page - 1) * take;

    return this.prismaClient.order.findMany({
      where: {
        userId: userId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                cashbackPercentage: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * 🔹 Buscar pedidos da loja (frontend loja)
   */
  async findManyByStoreId(
    storeId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsAndProducts[]> {
    const take = 20;
    const skip = (page - 1) * take;

    return this.prismaClient.order.findMany({
      where: {
        storeId: storeId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /**
   * 🔹 Buscar pedidos da loja (admin)
   */
  async findManyWithItems(
    page: number,
    status: OrderStatus | undefined,
    storeId: string,
  ) {
    const limit = 8;

    const orders = await this.prismaClient.order.findMany({
      where: {
        storeId: storeId,
        ...(status && { status }),
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { name: true },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      id: order.id,
      userId: order.userId,
      user_name: order.user.name,
      storeId: order.storeId,
      totalAmount: Number(order.totalAmount),
      discountApplied: order.discountApplied
        ? Number(order.discountApplied)
        : null,

      qrCodeUrl: order.qrCodeUrl,
      status: order.status,
      validated_at: order.validatedAt,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        quantity: Number(item.quantity),
        product: item.product
          ? {
              id: item.product.id,
              name: item.product.name,
              image: item.product.image,
              price: Number(item.product.price),
              cashbackPercentage: item.product.cashbackPercentage,
            }
          : null,
      })),
    }));
  }

  /**
   * 🔹 Atualizar status
   */
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.prismaClient.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  /**
   * 🔹 Atualizar status (TX)
   */
  async updateStatusWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
    status: OrderStatus,
  ): Promise<void> {
    await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  /**
   * 🔹 Marcar pedido como validado (TX)
   */
  async markAsValidatedWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<void> {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.VALIDATED,
        validatedAt: new Date(),
      },
    });
  }

  /**
   * 🔹 Cancelar pedido
   */
  async cancel(orderId: string): Promise<void> {
    await this.prismaClient.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.EXPIRED },
    });
  }
}
