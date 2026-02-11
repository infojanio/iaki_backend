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
      createdAt: order.createdAt,
      validatedAt: order.validatedAt,
      qrCodeUrl: order.qrCodeUrl ?? undefined,

      items: order.items.map((item) => {
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
            cashbackPercentage: item.product.cashbackPercentage,
          },
        };
      }),
    };
  }
}
