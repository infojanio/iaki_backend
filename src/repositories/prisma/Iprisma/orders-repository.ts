import { OrderWithItemsAndProducts } from "@/@types/order-with-items";
import { OrderWithItemsProductsAndStore } from "@/@types/order-with-items-products-and-store";
import { Order, OrderItem, OrderStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface OrderItemInput {
  productId: string;
  quantity: number;
  subtotal: Decimal;
}

export interface OrdersRepository {
  // 🔹 Checkout (Cart → Order)

  create(data: {
    user_id: string;
    store_id: string;
    totalAmount: Decimal;
    discountApplied: Decimal;
    status: "PENDING" | "VALIDATED" | "EXPIRED";
    items: OrderItemInput[];
  }): Promise<any>;

  // 🔹 Buscar pedido completo (itens + produtos)
  findById(orderId: string): Promise<OrderWithItemsProductsAndStore | null>;

  // 🔹 Buscar pedidos do usuário
  findManyByUserId(
    userId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsProductsAndStore[]>;

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
