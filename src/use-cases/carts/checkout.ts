import { Decimal } from "@prisma/client/runtime/library";
import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface CheckoutUseCaseRequest {
  userId: string;
  storeId: string;
}

export class CheckoutUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({ userId, storeId }: CheckoutUseCaseRequest) {
    // 1️⃣ buscar carrinho OPEN da loja
    const cart = await this.cartsRepository.findOpenByUserAndStoreWithItems(
      userId,
      storeId,
    );

    if (!cart || cart.items.length === 0) {
      throw new ResourceNotFoundError();
    }

    // 2️⃣ calcular totais (snapshot final)
    let totalAmount = new Decimal(0);
    let totalCashback = new Decimal(0);

    const orderItems = cart.items.map((item) => {
      const subtotal = item.priceSnapshot.mul(item.quantity);
      const cashback = subtotal.mul(item.cashbackSnapshot).div(100);

      totalAmount = totalAmount.plus(subtotal);
      totalCashback = totalCashback.plus(cashback);

      return {
        productId: item.productId,
        quantity: item.quantity,
        subtotal,
      };
    });

    // 3️⃣ criar pedido
    const order = await this.ordersRepository.create({
      userId,
      storeId,
      totalAmount,
      items: orderItems,
    });

    // 4️⃣ limpar carrinho
    await this.cartsRepository.clearCart(cart.id);

    // 5️⃣ retorno
    return {
      orderId: order.id,
      totalAmount,
      cashbackEstimated: totalCashback,
      status: order.status,
    };
  }
}
