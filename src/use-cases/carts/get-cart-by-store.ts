import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { Decimal } from "@prisma/client/runtime/library";

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

      const cashbackEstimated = subtotal.mul(item.cashbackSnapshot).div(100);

      return {
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        cashbackSnapshot: item.cashbackSnapshot,
        subtotal,
        cashbackEstimated,
      };
    });

    const subtotal = items.reduce(
      (acc, item) => acc.plus(item.subtotal),
      new Decimal(0),
    );

    const cashbackEstimated = items.reduce(
      (acc, item) => acc.plus(item.cashbackEstimated),
      new Decimal(0),
    );

    return {
      cartId: cart.id,
      storeId,
      items,
      totals: {
        subtotal, // Decimal
        cashbackEstimated, // Decimal
      },
    };
  }
}
