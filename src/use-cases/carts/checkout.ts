import { Decimal } from "@prisma/client/runtime/library";
import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { CartNotFoundError } from "@/utils/messages/errors/cart-not-found-error";

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
    // 1️⃣ Buscar carrinho OPEN da loja
    const cart = await this.cartsRepository.findOpenByUserAndStoreWithItems(
      userId,
      storeId,
    );

    if (!cart || cart.items.length === 0) {
      throw new CartNotFoundError();
    }

    // 2️⃣ Calcular totais
    let totalAmount = new Decimal(0);
    let cashbackEstimated = new Decimal(0);

    const orderItems = cart.items.map((item) => {
      const subtotal = item.priceSnapshot.mul(item.quantity);
      const cashback = subtotal.mul(item.cashbackSnapshot).div(100);

      totalAmount = totalAmount.plus(subtotal);
      cashbackEstimated = cashbackEstimated.plus(cashback);

      return {
        productId: item.productId,
        quantity: item.quantity,
        subtotal,
      };
    });

    // 3️⃣ Criar pedido (PENDING)
    const order = await this.ordersRepository.create({
      user_id: userId,
      store_id: storeId,
      totalAmount,
      discountApplied: new Decimal(0),
      status: "PENDING",
      items: orderItems,
    });

    // 4️⃣ Atualizar carrinho → CHECKED_OUT
    await this.cartsRepository.updateStatus(cart.id, "CHECKED_OUT");

    // 5️⃣ Retorno
    return {
      orderId: order.id,
      totalAmount,
      cashbackEstimated,
      status: order.status,
    };
  }
}
