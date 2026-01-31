import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderStatus } from "@prisma/client";

interface GetOrderUseCaseRequest {
  orderId: string;
}

interface GetOrderUseCaseResponse {
  id: string;
  store: {
    id: string;
    name: string;
  };
  totalAmount: number;
  discountApplied: number;
  status: OrderStatus;
  created_at: Date;
  validated_at: Date | null;
  qrCodeUrl?: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image: string | null;
      cashback_percentage: number;
    };
  }>;
}

export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return {
      id: order.id,
      store: {
        id: order.store.id,
        name: order.store.name,
      },
      totalAmount: Number(order.totalAmount),
      discountApplied: Number(order.discountApplied ?? 0),
      status: order.status,
      created_at: order.created_at,
      validated_at: order.validated_at,
      qrCodeUrl: order.qrCodeUrl ?? undefined,
      items: order.orderItems.map((item) => ({
        id: item.id,
        quantity: Number(item.quantity),
        product: {
          id: item.product.id,
          name: item.product.name,
          price: Number(item.product.price),
          image: item.product.image ?? null,
          cashback_percentage: item.product.cashback_percentage,
        },
      })),
    };
  }
}
