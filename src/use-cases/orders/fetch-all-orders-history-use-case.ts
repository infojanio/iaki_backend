// src/use-cases/fetch-all-orders-history-use-case.ts

import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";

interface FetchAllOrdersHistoryUseCaseRequest {
  page: number;
  status?: OrderStatus;
  storeId: string; // 🔥 já validado no controller
}

interface FetchAllOrdersHistoryUseCaseResponse {
  orders: Array<{
    id: string;
    userId: string;
    user_name: string;
    storeId: string;
    totalAmount: number;
    discountApplied: number;
    qrCodeUrl?: string;
    status: OrderStatus;
    validatedAt: Date | null;
    createdAt: Date;
    items: Array<{
      product: {
        id: string;
        name: string;
        image?: string | null;
        price: number;
        cashbackPercentage: number;
      } | null;
      quantity: number;
    }>;
  }>;
}

export class FetchAllOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    page,
    status,
    storeId,
  }: FetchAllOrdersHistoryUseCaseRequest): Promise<FetchAllOrdersHistoryUseCaseResponse> {
    /**
     * 📦 Busca pedidos da loja
     * (assume que storeId é válido)
     */
    const orders = await this.ordersRepository.findManyWithItems(
      page,
      status,
      storeId,
    );

    /**
     * 🧾 Normalização do retorno
     */
    return {
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        user_name: order.user_name,
        storeId: order.storeId,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied ?? 0,
        qrCodeUrl: order.qrCodeUrl ?? undefined,
        status: order.status,
        validatedAt: order.validatedAt,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image ?? null,
                price: item.product.price,
                cashbackPercentage: item.product.cashbackPercentage,
              }
            : null,
          quantity: item.quantity,
        })),
      })),
    };
  }
}
