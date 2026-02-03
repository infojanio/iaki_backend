import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface RedeemCashbackUseCaseRequest {
  user_id: string;
  order_id: string;
  amount: number;
}

export class RedeemCashbackUseCase {
  constructor(
    private cashbacksRepository: CashbacksRepository,
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({ user_id, order_id, amount }: RedeemCashbackUseCaseRequest) {
    // 1️⃣ validação básica
    if (amount <= 0) {
      throw new Error("O valor deve ser positivo.");
    }

    // 2️⃣ busca pedido
    const order = await this.ordersRepository.findById(order_id);
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    const storeId = order.store_id;

    // 3️⃣ verifica saldo APENAS da loja do pedido
    const balance = await this.cashbacksRepository.getBalanceByStore(
      user_id,
      storeId,
    );

    if (balance + 0.001 < amount) {
      throw new Error("Saldo de cashback insuficiente para esta loja.");
    }

    // 4️⃣ valida se não excede o total do pedido
    if (amount > order.totalAmount.toNumber()) {
      throw new Error("O valor do cashback excede o total do pedido.");
    }

    // 5️⃣ registra transação de uso
    await this.cashbacksRepository.createTransaction({
      userId: user_id,
      storeId,
      orderId: order_id,
      amount: new Decimal(amount),
      type: "USE",
    });

    // 6️⃣ registra débito (cashback negativo)
    await this.cashbacksRepository.redeemCashback({
      userId: user_id,
      storeId,
      orderId: order_id,
      amount: new Decimal(amount).negated(),
    });
  }
}
