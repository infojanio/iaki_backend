import { prisma } from "@/lib/prisma";
import { Prisma, OrderItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { randomUUID } from "crypto";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository";

export interface OrderItemsRepository {
  create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void>;
  findByOrderId(orderId: string): Promise<OrderItem[]>;
}

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  private ordersRepository: InMemoryOrdersRepository;

  constructor(ordersRepository: InMemoryOrdersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async create(
    orderId: string,
    items: Prisma.OrderItemUncheckedCreateInput[],
  ): Promise<void> {
    // 🔍 Verificar se o pedido existe na memória antes de consultar no banco
    const orderExists = this.ordersRepository.orders.find(
      (order) => order.id === orderId,
    );

    if (!orderExists) {
      throw new Error(`Pedido com ID ${orderId} não encontrado.`);
    }

    // ✅ Criar os itens diretamente na memória
    const newItems = items.map((item) => ({
      id: randomUUID(),
      orderId: orderId,
      product_id: item.product_id,
      quantity: new Prisma.Decimal(item.quantity),
      subtotal: new Prisma.Decimal(item.subtotal),
      createdAt: new Date(),
    }));

    this.items.push(...newItems);
    console.log("items criados", newItems);
  }

  public items: OrderItem[] = [];

  async createMany(
    orderItems: {
      orderId: string;
      product_id: string;
      quantity: Decimal;
      subtotal: Decimal;
    }[],
  ) {
    for (const item of orderItems) {
      await this.create(item.orderId, [item]);
    }

    return this.items;
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.items.filter((item) => item.orderId === orderId);
  }
}
