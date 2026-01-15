import { PrismaClient, Cart, CartItem } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CartsRepository } from "./Iprisma/carts-repository";
import { CartWithItems } from "@/@types/cart-with-items";

export class PrismaCartsRepository implements CartsRepository {
  constructor(private prisma: PrismaClient) {}

  async findOpenByUserAndStoreWithItems(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null> {
    return this.prisma.cart.findFirst({
      where: {
        userId,
        storeId,
        status: "OPEN",
      },
      include: {
        store: true, // 🔥 OBRIGATÓRIO
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // 🔹 Buscar carrinho OPEN por usuário + loja
  async findOpenByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null> {
    return this.prisma.cart.findFirst({
      where: {
        userId,
        storeId,
        status: "OPEN",
      },
      include: {
        store: true,
        items: {
          include: {
            product: true, // ✅ ESSENCIAL
          },
        },
      },
    });
  }

  // 🔹 Criar carrinho OPEN para loja
  async create(data: { userId: string; storeId: string }): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        status: "OPEN",
      },
    });
  }

  // 🔹 Adiciona item ou soma quantidade (snapshot garantido)
  async addOrUpdateItem({
    cartId,
    productId,
    quantity,
    priceSnapshot,
    cashbackSnapshot,
  }: {
    cartId: string;
    productId: string;
    quantity: number;
    priceSnapshot: Decimal;
    cashbackSnapshot: Decimal;
  }): Promise<CartItem> {
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        priceSnapshot,
        cashbackSnapshot,
      },
    });
  }

  // 🔹 Atualiza quantidade diretamente (ex: + / - no carrinho)
  async updateItemQuantity(
    cartId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    return this.prisma.cartItem
      .updateMany({
        where: { cartId, productId },
        data: { quantity },
      })
      .then(() =>
        this.prisma.cartItem.findFirstOrThrow({
          where: { cartId, productId },
        }),
      );
  }

  // 🔹 Remove item do carrinho
  async removeItemByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        productId,
        cart: { userId },
      },
    });
  }

  async clearCartByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
          storeId,
        },
      },
    });
  }

  async removeItemByCartAndProduct(
    cartId: string,
    productId: string,
  ): Promise<void> {
    await this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
    });
  }

  // 🔹 Buscar carrinho da loja atual (com itens)
  async getCartByStore(userId: string, storeId: string) {
    return this.prisma.cart.findFirst({
      where: {
        userId,
        storeId,
        status: "OPEN",
      },
      include: {
        store: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
