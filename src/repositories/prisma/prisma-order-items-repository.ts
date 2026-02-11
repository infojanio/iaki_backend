import { prisma } from "@/lib/prisma";
import { Prisma, OrderItem } from "@prisma/client";

export interface OrderItemsRepository {
  create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>;

  findByOrderId(orderId: string): Promise<OrderItem[]>;
  /*
  createMany(
    orderItems: Prisma.OrderItemCreateManyInput[],
  ): Promise<OrderItem[]>
  */
}

export class PrismaOrderItemsRepository implements OrderItemsRepository {
  async createMany(orderItems: Prisma.OrderItemCreateManyInput[]) {
    // Certifique-se de que todos os orderIds existem antes de inserir
    const orderIds = orderItems.map((item) => item.orderId);
    const existingOrders = await prisma.order.findMany({
      where: { id: { in: orderIds } },
      select: { id: true },
    });

    const existingOrderIds = new Set(existingOrders.map((o) => o.id));
    const invalidOrderIds = orderIds.filter((id) => !existingOrderIds.has(id));

    if (invalidOrderIds.length > 0) {
      throw new Error(
        `Os seguintes orderId não existem: ${invalidOrderIds.join(", ")}`,
      );
    }

    return prisma.orderItem.createMany({ data: orderItems });
  }

  async create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    await prisma.orderItem.createMany({
      data: items.map((item) => ({
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    });
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return await prisma.orderItem.findMany({
      where: { orderId: orderId },
    });
  }
}
