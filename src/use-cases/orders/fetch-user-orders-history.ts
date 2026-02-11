import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";

interface FetchUserOrdersHistoryUseCaseRequest {
  userId: string;
  page: number;
  status?: OrderStatus;
}

interface FetchUserOrdersHistoryUseCaseResponse {
  orders: Array<{
    id: string;
    store: {
      id: string;
      name: string;
    };
    totalAmount: number;
    discountApplied: number;
    qrCodeUrl?: string;
    status: OrderStatus;
    validatedAt: Date | null;
    createdAt: Date;
    items: Array<{
      quantity: number;
      product: {
        name: string;
        image: string | null;
        price: number;
        cashbackPercentage: number;
      };
    }>;
  }>;
}

export class FetchUserOrdersHistoryUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
    status,
  }: FetchUserOrdersHistoryUseCaseRequest): Promise<FetchUserOrdersHistoryUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByUserId(
      userId,
      page,
      status,
    );

    return {
      orders: orders.map((order) => ({
        id: order.id,
        store: {
          id: order.store.id,
          name: order.store.name, // 🔥 AQUI ESTÁ O PONTO-CHAVE
        },
        totalAmount: Number(order.totalAmount),
        discountApplied: Number(order.discountApplied ?? 0),
        qrCodeUrl: order.qrCodeUrl ?? undefined,
        status: order.status,
        validatedAt: order.validatedAt,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          quantity: Number(item.quantity),
          product: {
            name: item.product.name,
            image: item.product.image ?? null,
            price: Number(item.product.price),
            cashbackPercentage: item.product.cashbackPercentage,
          },
        })),
      })),
    };
  }
}
