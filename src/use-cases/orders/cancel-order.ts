import { OrdersRepository } from "@/repositories/prisma/Iprisma/orders-repository";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface CancelOrderUseCaseRequest {
  orderId: string;
  admin_userId: string; // Usuário que está validando o pedido (ADMIN)
}

export class CancelOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ orderId, admin_userId }: CancelOrderUseCaseRequest) {
    const adminUser = await this.usersRepository.findById(admin_userId);

    if (!adminUser || adminUser.role !== "ADMIN") {
      throw new Error("Apenas usuários ADMIN podem cancelar pedidos.");
    }

    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Pedido não encontrado.");
    }

    if (order.status !== "PENDING") {
      throw new Error(
        "Apenas pedidos com status PENDING podem ser cancelados.",
      );
    }

    // Atualizar status do pedido para EXPIRED
    await this.ordersRepository.updateStatus(orderId, "EXPIRED");

    return { orderId, status: "EXPIRED" };
  }
}
