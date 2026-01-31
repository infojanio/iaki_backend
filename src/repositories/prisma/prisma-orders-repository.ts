import { PrismaClient, OrderStatus } from "@prisma/client";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderWithItemsProductsAndStore } from "@/@types/order-with-items-products-and-store";

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    user_id: string;
    store_id: string;
    totalAmount: any;
    discountApplied: any;
    status: "PENDING" | "VALIDATED" | "EXPIRED";
    items: {
      productId: string;
      quantity: number;
      subtotal: any;
    }[];
  }) {
    return this.prisma.order.create({
      data: {
        user_id: data.user_id,
        store_id: data.store_id,
        totalAmount: data.totalAmount,
        discountApplied: data.discountApplied,
        status: data.status,
        orderItems: {
          create: data.items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
    });
  }

  async findById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        orderItems: {
          select: {
            id: true, // 🔥 OBRIGATÓRIO
            quantity: true,
            product: {
              select: {
                id: true, // 🔥 OBRIGATÓRIO
                name: true,
                image: true,
                price: true,
                cashback_percentage: true,
              },
            },
          },
        },
      },
    });
  }
  async findManyByUserId(
    userId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsProductsAndStore[]> {
    const take = 10;
    const skip = (page - 1) * take;

    return this.prisma.order.findMany({
      where: {
        user_id: userId,
        ...(status && { status }),
      },
      orderBy: {
        created_at: "desc",
      },
      take,
      skip,
      include: {
        store: {
          select: {
            id: true,
            name: true, // 🔥 ESSENCIAL
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                cashback_percentage: true,
              },
            },
          },
        },
      },
    });
  }

  async findManyByStoreId(storeId: string, page: number, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        store_id: storeId,
        ...(status ? { status } : {}),
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: 20,
      skip: (page - 1) * 20,
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async markAsValidated(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.VALIDATED,
        validated_at: new Date(),
      },
    });
  }

  async cancel(orderId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.EXPIRED },
    });
  }
}
