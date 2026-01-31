import { PrismaClient, Cart, CartItem, CartStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { CartsRepository } from "./Iprisma/carts-repository";
import { CartWithItems } from "@/@types/cart-with-items";
import { OpenCartWithItems } from "@/@types/open-cart-with-items";

export class PrismaCartsRepository implements CartsRepository {
  constructor(private prisma: PrismaClient) {}

  // ===== NOVOS =====

  async findOpenByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null> {
    return this.prisma.cart.findFirst({
      where: { userId, storeId, status: CartStatus.OPEN },
      include: {
        store: true,
        items: { include: { product: true } },
      },
    });
  }

  async findOpenByUserAndStoreWithItems(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null> {
    return this.findOpenByUserAndStore(userId, storeId);
  }

  async create(data: { userId: string; storeId: string }): Promise<Cart> {
    return this.prisma.cart.create({
      data: {
        userId: data.userId,
        storeId: data.storeId,
        status: CartStatus.OPEN,
      },
    });
  }

  // 🔥 FECHA TODOS OS CARRINHOS OPEN DO USUÁRIO
  async closeAllOpenCartsByUser(userId: string): Promise<void> {
    await this.prisma.cart.updateMany({
      where: {
        userId,
        status: CartStatus.OPEN,
      },
      data: {
        status: CartStatus.CLOSED,
      },
    });
  }

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
    cashbackSnapshot: number;
  }): Promise<CartItem> {
    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId, productId },
    });

    if (existing) {
      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
        priceSnapshot,
        cashbackSnapshot: new Decimal(cashbackSnapshot),
      },
    });
  }

  async updateStatus(cartId: string, status: CartStatus): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { status },
    });
  }

  async updateItemQuantity({
    cartItemId,
    quantity,
  }: {
    cartItemId: string;
    quantity: number;
  }): Promise<CartItem> {
    return this.prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  async removeItem(cartItemId: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async clearCartByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cart: { userId, storeId } },
    });
  }

  async getCartByStore(
    userId: string,
    storeId: string,
  ): Promise<CartWithItems | null> {
    return this.findOpenByUserAndStore(userId, storeId);
  }

  // ===== ALIASES (MÉTODOS ANTIGOS) =====

  /** 🔁 Usado por get-open-cart.ts */
  async findLatestOpenCartByUser(
    userId: string,
  ): Promise<OpenCartWithItems | null> {
    const cart = await this.prisma.cart.findFirst({
      where: {
        userId,
        status: "OPEN",
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                cashback_percentage: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    // 🔥 MAPEAMENTO EXPLÍCITO (a chave da solução)
    return {
      id: cart.id,
      userId: cart.userId,
      storeId: cart.storeId,
      status: "OPEN",
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      store: cart.store,
      items: cart.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        cashbackSnapshot: Number(item.cashbackSnapshot), // ✅ Decimal → number
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          cashback_percentage: item.product.cashback_percentage,
        },
      })),
    };
  }

  /** 🔁 Usado por remove-item use-case antigo */
  async removeItemByCartAndProduct(
    cartId: string,
    productId: string,
  ): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: { cartId, productId },
    });
  }
}
