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
    // 1️⃣ Buscar carrinho aberto APENAS pelo usuário
    const cart = await this.cartsRepository.findLatestOpenCartByUser(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error("Carrinho vazio ou inexistente.");
    }

    // ✅ GARANTIA ABSOLUTA DA LOJA
    const resolvedStoreId = cart.storeId;

    if (!resolvedStoreId) {
      throw new Error("Loja não informada.");
    }

    // 2️⃣ Totais
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
        productId: item.productId,
        quantity: Number(quantity),
        subtotal,
      };
    });

    // 3️⃣ Criar pedido (🔥 storeId vem do cart)
    const order = await this.ordersRepository.create({
      userId: userId,
      storeId: resolvedStoreId,
      totalAmount,
      cashbackAmount: new Decimal(0),
      discountApplied: new Decimal(0),
      status: OrderStatus.PENDING,
      items: orderItems,
    });

    // 4️⃣ Cashback
    await this.cashbacksRepository.create({
      userId: userId,
      storeId: resolvedStoreId,
      orderId: order.id,
      amount: cashbackTotal,
      status: "PENDING",
      creditedAt: new Date(),
    });

    // 5️⃣ Limpa carrinho (mantendo seu método atual)
    await this.cartsRepository.clearCartByUserAndStore(userId, resolvedStoreId);

    return order;
  }
}
