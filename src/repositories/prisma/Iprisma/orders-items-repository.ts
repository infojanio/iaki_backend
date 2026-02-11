import { OrderItem, Prisma } from "@prisma/client";

export interface OrderItemCreateInput {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  subtotal: number;
}

export interface OrderItemsRepository {
  create(data: Prisma.OrderItemCreateInput): Promise<OrderItem>;
  findByProductId(productId: string): Promise<OrderItem[]>;
  createMany(orderItems: Prisma.OrderItemCreateManyInput): Promise<OrderItem[]>;
}
