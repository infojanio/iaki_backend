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
    user_id: string;
    user_name: string;
    store_id: string;
    totalAmount: number;
    discountApplied: number;
    qrCodeUrl?: string;
    status: OrderStatus;
    validated_at: Date | null;
    created_at: Date;
    items: Array<{
      product: {
        id: string;
        name: string;
        image?: string | null;
        price: number;
        cashback_percentage: number;
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
        user_id: order.user_id,
        user_name: order.user_name,
        store_id: order.store_id,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied ?? 0,
        qrCodeUrl: order.qrCodeUrl ?? undefined,
        status: order.status,
        validated_at: order.validated_at,
        created_at: order.created_at,
        items: order.items.map((item) => ({
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image ?? null,
                price: item.product.price,
                cashback_percentage: item.product.cashback_percentage,
              }
            : null,
          quantity: item.quantity,
        })),
      })),
    };
  }
}
