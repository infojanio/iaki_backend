import { OrderWithItemsAndProducts } from "@/@types/order-with-items";
import { OrderWithItemsProductsAndStore } from "@/@types/order-with-items-products-and-store";
import { OrderStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TransactionRepositories } from "./transaction-repository";

interface OrderItemInput {
  productId: string;
  quantity: number;
  subtotal: Decimal;
}

export interface OrdersRepository {
  /**
   * 🔹 Checkout (Cart → Order)
   */
  create(data: {
    user_id: string;
    store_id: string;
    totalAmount: Decimal;
    discountApplied: Decimal;
    status: OrderStatus;
    items: OrderItemInput[];
  }): Promise<any>;

  /**
   * 🔹 Buscar pedido completo (itens + produtos + store)
   */
  findById(orderId: string): Promise<OrderWithItemsProductsAndStore | null>;

  /**
   * 🔹 Buscar pedido completo (TX)
   */
  findByIdWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<OrderWithItemsProductsAndStore | null>;

  /**
   * 🔹 Buscar pedidos do usuário
   */
  findManyByUserId(
    userId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsProductsAndStore[]>;

  /**
   * 🔹 Buscar pedidos da loja (admin)
   */
  findManyWithItems(
    page: number,
    status: OrderStatus | undefined,
    storeId: string,
  ): Promise<
    {
      id: string;
      user_id: string;
      user_name: string;
      store_id: string;
      totalAmount: number;
      discountApplied: number | null;
      qrCodeUrl: string | null;
      status: OrderStatus;
      validated_at: Date | null;
      created_at: Date;
      items: {
        quantity: number;
        product: {
          id: string;
          name: string;
          image: string | null;
          price: number;
          cashback_percentage: number;
        } | null;
      }[];
    }[]
  >;

  /**
   * 🔹 Buscar pedidos da loja (frontend loja)
   */
  findManyByStoreId(
    storeId: string,
    page: number,
    status?: OrderStatus,
  ): Promise<OrderWithItemsAndProducts[]>;

  /**
   * 🔹 Atualizar status
   */
  updateStatus(orderId: string, status: OrderStatus): Promise<void>;

  /**
   * 🔹 Atualizar status (TX)
   */
  updateStatusWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
    status: OrderStatus,
  ): Promise<void>;

  /**
   * 🔹 Marcar pedido como validado
   */
  markAsValidated(orderId: string): Promise<void>;

  /**
   * 🔹 Marcar pedido como validado (TX)
   */
  markAsValidatedWithTx(
    tx: Prisma.TransactionClient,
    orderId: string,
  ): Promise<void>;

  /**
   * 🔹 Cancelar pedido
   */
  cancel(orderId: string): Promise<void>;
}
