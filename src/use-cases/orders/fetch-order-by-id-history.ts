import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { OrderNotFoundError } from "@/utils/messages/errors/order-not-found-error";

interface FetchOrderByIdUseCaseRequest {
  orderId: string;
}

export class FetchOrderByIdHistoryUseCase {
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

        latitude:
          order.store.latitude == null ? null : Number(order.store.latitude),

        longitude:
          order.store.longitude == null ? null : Number(order.store.longitude),
      },

      totalAmount: Number(order.totalAmount),
      discountApplied: Number(order.discountApplied ?? 0),
      status: order.status,
      createdAt: order.createdAt,
      validatedAt: order.validatedAt,
      qrCodeUrl: order.qrCodeUrl ?? undefined,

      items: order.items.map((item) => {
        const quantity = Number(item.quantity);

        // Usa o subtotal salvo no pedido.
        const subtotal = Number(item.subtotal);

        const price =
          quantity > 0 ? subtotal / quantity : Number(item.product.price);

        return {
          id: item.id,
          quantity,
          subtotal,

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
