import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface GetCartSummaryByStoreUseCaseRequest {
  userId: string;
  storeId: string;
}

export class GetCartSummaryByStoreUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({ userId, storeId }: GetCartSummaryByStoreUseCaseRequest) {
    const cart = await this.cartsRepository.findOpenByUserAndStore(
      userId,
      storeId,
    );

    if (!cart || cart.items.length === 0) {
      return {
        store: null,
        items: [],
        totals: {
          itemsCount: 0,
          subtotal: 0,
          cashbackEstimated: 0,
          total: 0,
        },
      };
    }

    let subtotal = new Decimal(0);
    let cashbackEstimated = new Decimal(0);

    const items = cart.items.map((item) => {
      const itemSubtotal = item.priceSnapshot.mul(item.quantity);
      const itemCashback = itemSubtotal.mul(item.cashbackSnapshot).div(100);

      subtotal = subtotal.add(itemSubtotal);
      cashbackEstimated = cashbackEstimated.add(itemCashback);

      return {
        productId: item.productId,
        name: item.product.name,
        image: item.product.image,
        price: item.priceSnapshot.toNumber(),
        quantity: item.quantity,
        subtotal: itemSubtotal.toNumber(),
        cashback: itemCashback.toNumber(),
      };
    });

    return {
      store: {
        id: cart.store.id,
        name: cart.store.name,
        avatar: cart.store.avatar,
      },
      items,
      totals: {
        itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: subtotal.toNumber(),
        cashbackEstimated: cashbackEstimated.toNumber(),
        total: subtotal.toNumber(), // cashback não desconta ainda
      },
    };
  }
}
