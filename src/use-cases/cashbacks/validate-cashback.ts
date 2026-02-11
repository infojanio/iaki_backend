import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";

interface ValidateCashbackUseCaseRequest {
  orderId: string;
  userId: string;
  cashbackAmount: number;
}

export class ValidateCashback {
  constructor(
    private cashbacksRepository: CashbacksRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    orderId,
    userId,
    cashbackAmount,
  }: ValidateCashbackUseCaseRequest): Promise<void> {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Order not found.");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized operation.");
    }

    if (order.validated_at) {
      throw new Error("Cashback already validated for this order.");
    }

    /* Aplica cashback positivo
    await this.cashbacksRepository.applyCashback(
      orderId,
      userId,
      cashbackAmount,
    )
      */

    // Atualiza o pedido como validado
    await this.ordersRepository.markAsValidated(orderId);
  }
}
