import { CartWithItems } from "@/@types/cart-with-items";
import { Cart, CartItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CartsRepository {
  // ===== NOVOS (modelo atual) =====
  findOpenByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;

  create(data: { userId: string; storeId: string }): Promise<Cart>;

  addOrUpdateItem(data: {
    cartId: string;
    productId: string;
    quantity: number;
    priceSnapshot: Decimal;
    cashbackSnapshot: number;
  }): Promise<CartItem>;

  findOpenByUserAndStoreWithItems(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;

  updateItemQuantity(data: {
    cartItemId: string;
    quantity: number;
  }): Promise<CartItem>;

  removeItem(cartItemId: string): Promise<void>;
  clearCart(cartId: string): Promise<void>;

  clearCartByUserAndStore(userId: string, storeId: string): Promise<void>;

  getCartByStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;

  // ===== MÉTODOS ANTIGOS (COMPATIBILIDADE) =====

  /** 🔁 Alias para get-open-cart.ts */
  findLatestOpenCartByUser(userId: string): Promise<CartWithItems | null>;

  /** 🔁 Alias para removeItem */
  removeItemByCartAndProduct(cartId: string, productId: string): Promise<void>;
}
