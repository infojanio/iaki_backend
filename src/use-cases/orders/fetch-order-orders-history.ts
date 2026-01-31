import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderNotFoundError } from "@/utils/messages/errors/order-not-found-error";

interface FetchOrderByIdUseCaseRequest {
  orderId: string;
}

export class FetchOrderByIdUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ orderId }: FetchOrderByIdUseCaseRequest) {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new OrderNotFoundError();
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

      items: order.orderItems.map((item) => {
        const price = Number(item.product.price);
        const quantity = Number(item.quantity);
        const subtotal = price * quantity;

        return {
          id: item.id,
          quantity,
          subtotal, // ✅ calculado corretamente
          product: {
            id: item.product.id,
            name: item.product.name,
            image: item.product.image ?? null,
            price,
            cashback_percentage: item.product.cashback_percentage,
          },
        };
      }),
    };
  }
}
