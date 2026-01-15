import { OrderWithItemsAndProducts } from "@/@types/order-with-items";
import { Order, OrderItem, OrderStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  subtotal: Decimal;
}

export interface OrdersRepository {
  // 🔹 Checkout (Cart → Order)
  create(data: Prisma.OrderUncheckedCreateInput): Promise<Order>;

  // 🔹 Buscar pedido completo (itens + produtos)
  findById(orderId: string): Promise<OrderWithItemsAndProducts | null>;

  // 🔹 Buscar pedidos do usuário
  findManyByUserId(
    userId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsAndProducts[]>;

  // 🔹 Buscar pedidos da loja
  findManyByStoreId(
    storeId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsAndProducts[]>;

  // 🔹 Status / validação
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;

  markAsValidated(orderId: string): Promise<Order>;

  cancel(orderId: string): Promise<Order>;
}
