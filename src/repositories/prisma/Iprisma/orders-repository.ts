import { OrderWithItemsAndProducts } from "@/@types/order-with-items";
import { OrderWithItemsProductsAndStore } from "@/@types/order-with-items-products-and-store";
import { OrderStatus, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface OrderItemInput {
  productId: string;
  quantity: number;
  subtotal: Decimal;
}

export interface OrdersRepository {
  /**
   * 🔹 Checkout (Cart → Order)
   * Aqui já deve salvar cashbackAmount
   */
  create(data: {
    userId: string;
    storeId: string;
    totalAmount: Decimal | number;
    discountApplied: Decimal;
    cashbackAmount: Decimal; // 👈 IMPORTANTE
    status: OrderStatus;
    items: OrderItemInput[];
  }): Promise<any>;

  /**
   * 🔹 Buscar pedido por ID
   */
  findById(orderId: string): Promise<OrderWithItemsProductsAndStore | null>;

  /**
   * 🔹 Buscar pedido por ID (TX)
   * 👉 usado na validação simples
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
      userId: string;
      user_name: string;
      storeId: string;
      totalAmount: number;
      discountApplied: number | null;
      qrCodeUrl: string | null;
      status: OrderStatus;
      validatedAt: Date | null;
      createdAt: Date;
      items: {
        quantity: number;
        product: {
          id: string;
          name: string;
          image: string | null;
          price: number;
          cashbackPercentage: number;
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
   * 🔹 Atualizar status (simples)
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
   * 🔹 Marcar pedido como validado (TX)
   * 👉 NÃO calcula cashback
   * 👉 Apenas muda status + validated_at
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
