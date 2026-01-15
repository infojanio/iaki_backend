import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateOrderUseCaseRequest {
  userId: string;
  storeId: string;
}

export class CreateOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private cartsRepository: CartsRepository,
    private cashbacksRepository: CashbacksRepository,
  ) {}

  async execute({ userId, storeId }: CreateOrderUseCaseRequest) {
    // 1️⃣ Busca carrinho aberto do usuário + loja
    const cart = await this.cartsRepository.findOpenByUserAndStore(
      userId,
      storeId,
    );

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio ou inexistente.");
    }

    // 2️⃣ Calcula totais com snapshot
    let totalAmount = new Decimal(0);
    let cashbackTotal = new Decimal(0);

    const orderItems = cart.items.map((item) => {
      const price = item.priceSnapshot;
      const quantity = new Decimal(item.quantity);

      const subtotal = price.mul(quantity);
      totalAmount = totalAmount.add(subtotal);

      const cashback = subtotal.mul(item.cashbackSnapshot).div(100);

      cashbackTotal = cashbackTotal.add(cashback);

      return {
        product_id: item.productId,
        quantity,
        subtotal,
      };
    });

    // 3️⃣ Cria pedido + itens
    const order = await this.ordersRepository.create({
      user_id: userId,
      store_id: storeId,
      totalAmount,
      discountApplied: new Decimal(0),
      status: OrderStatus.PENDING,
      orderItems: {
        createMany: {
          data: orderItems,
        },
      },
    });

    // 4️⃣ Cria cashback (PENDING)
    await this.cashbacksRepository.create({
      user_id: userId,
      store_id: storeId,
      order_id: order.id,
      amount: cashbackTotal,
      status: "PENDING",
      credited_at: new Date(),
    });

    // 5️⃣ Limpa carrinho da loja
    await this.cartsRepository.clearCartByUserAndStore(userId, storeId);

    return order;
  }
}
