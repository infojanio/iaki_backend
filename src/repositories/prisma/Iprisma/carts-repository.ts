import { CartWithItems } from "@/@types/cart-with-items";
import { Cart, CartItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CartsRepository {
  // 🔹 Carrinho OPEN do usuário para uma loja
  findOpenByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;

  // 🔹 Criar carrinho OPEN para loja
  create(data: { userId: string; storeId: string }): Promise<Cart>;

  removeItemByCartAndProduct(cartId: string, productId: string): Promise<void>;

  // 🔹 Adicionar ou somar item (com snapshot)
  addOrUpdateItem(data: {
    cartId: string;
    productId: string;
    quantity: number;
    priceSnapshot: Decimal | undefined;
    cashbackSnapshot: Decimal | undefined;
  }): Promise<CartItem>;

  // 🔹 usado quando precisamos acessar items
  findOpenByUserAndStoreWithItems(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;

  // 🔹 Atualizar quantidade diretamente (ex: + / -)
  updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem>;

  removeItemByUserAndProduct(userId: string, productId: string): Promise<void>;

  clearCartByUserAndStore(userId: string, storeId: string): Promise<void>;

  // 🔹 Buscar carrinho da loja (com itens)
  getCartByStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null>;
}
