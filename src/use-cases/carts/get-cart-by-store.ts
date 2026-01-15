import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";

interface GetCartByStoreUseCaseRequest {
  userId: string;
  storeId: string;
}

export class GetCartByStoreUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({ userId, storeId }: GetCartByStoreUseCaseRequest) {
    const cart = await this.cartsRepository.getCartByStore(userId, storeId);

    if (!cart) {
      return {
        cart: null,
        items: [],
        totals: {
          subtotal: 0,
          cashbackEstimated: 0,
        },
      };
    }

    const items = cart.items.map((item) => {
      const subtotal = item.priceSnapshot.mul(item.quantity);

      const cashback = subtotal.mul(item.cashbackSnapshot).div(100);

      return {
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        cashbackSnapshot: item.cashbackSnapshot,
        subtotal,
        cashbackEstimated: cashback,
      };
    });

    const subtotal = items.reduce(
      (acc, item) => acc.plus(item.subtotal),
      items[0]?.subtotal.constructor(0) ?? 0,
    );

    const cashbackEstimated = items.reduce(
      (acc, item) => acc.plus(item.cashbackEstimated),
      items[0]?.cashbackEstimated.constructor(0) ?? 0,
    );

    return {
      cartId: cart.id,
      storeId,
      items,
      totals: {
        subtotal,
        cashbackEstimated,
      },
    };
  }
}
