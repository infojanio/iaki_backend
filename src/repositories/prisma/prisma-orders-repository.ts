import { PrismaClient, OrderStatus, Prisma, Order } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { prisma } from "@/lib/prisma";

export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.OrderUncheckedCreateInput): Promise<Order> {
    return prisma.order.create({
      data,
    });
  }

  async findById(orderId: string) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findManyByUserId(userId: string, page: number, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        user_id: userId,
        status,
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

  async findManyByStoreId(storeId: string, page: number, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        store_id: storeId,
        status,
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
      data: {
        status: OrderStatus.EXPIRED,
      },
    });
  }
}
