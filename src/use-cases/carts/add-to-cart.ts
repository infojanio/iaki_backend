import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { StoreNotAvailableInCityError } from "@/utils/messages/errors/store-not-available-in-city-error";
import { Decimal } from "@prisma/client/runtime/library";

interface AddToCartUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
  quantity: number;
}

export class AddToCartUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    storeId,
    productId,
    quantity,
  }: AddToCartUseCaseRequest) {
    if (quantity <= 0) {
      throw new StoreNotAvailableInCityError();
    }

    // 🔹 valida produto
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    // 🔹 segurança: produto deve pertencer à loja
    if (product.store_id !== storeId) {
      throw new Error("Produto não pertence à loja selecionada");
    }

    // 🔥 PASSO 1: buscar último carrinho OPEN do usuário (qualquer loja)
    const latestOpenCart =
      await this.cartsRepository.findLatestOpenCartByUser(userId);

    // 🔥 PASSO 2: se existir e for de OUTRA loja → fechar
    if (latestOpenCart && latestOpenCart.storeId !== storeId) {
      await this.cartsRepository.closeAllOpenCartsByUser(userId);
    }

    // 🔹 PASSO 3: buscar carrinho OPEN da loja atual
    let cart = await this.cartsRepository.findOpenByUserAndStore(
      userId,
      storeId,
    );

    // 🔹 PASSO 4: criar carrinho se não existir
    if (!cart) {
      await this.cartsRepository.create({
        userId,
        storeId,
      });

      cart = await this.cartsRepository.findOpenByUserAndStore(userId, storeId);
    }

    if (!cart) {
      throw new Error("Erro ao criar ou recuperar carrinho");
    }

    // 🔒 snapshots SEMPRE definidos
    if (product.price === undefined) {
      throw new Error("Produto sem preço definido");
    }

    const priceSnapshot = new Decimal(product.price);
    const cashbackSnapshot = product.cashback_percentage ?? 0;

    // ➕ adiciona ou soma item
    const cartItem = await this.cartsRepository.addOrUpdateItem({
      cartId: cart.id,
      productId,
      quantity,
      priceSnapshot,
      cashbackSnapshot,
    });

    return {
      cartId: cart.id,
      item: cartItem,
    };
  }
}

/*
import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { StoreNotAvailableInCityError } from "@/utils/messages/errors/store-not-available-in-city-error";
import { Decimal } from "@prisma/client/runtime/library";
import { CartWithItems } from "@/@types/cart-with-items";

interface AddToCartUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
  quantity: number;
}

export class AddToCartUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    storeId,
    productId,
    quantity,
  }: AddToCartUseCaseRequest) {
    if (quantity <= 0) {
      throw new StoreNotAvailableInCityError();
    }

    // 🔹 valida produto
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    // 🔹 segurança: produto deve pertencer à loja
    if (product.store_id !== storeId) {
      throw new Error("Produto não pertence à loja selecionada");
    }

    // 🔥 busca último carrinho OPEN do usuário
    const latestOpenCart =
      await this.cartsRepository.findLatestOpenCartByUser(userId);

    let cart: CartWithItems | null = latestOpenCart;

    // 🔁 existe carrinho, mas de outra loja → RESET AUTOMÁTICO
    if (latestOpenCart && latestOpenCart.storeId !== storeId) {
      await this.cartsRepository.deleteItemsByCartId(latestOpenCart.id);
      await this.cartsRepository.updateStore(latestOpenCart.id, storeId);

      // 🔁 rehidrata carrinho com store + items
      cart = await this.cartsRepository.findLatestOpenCartByUser(userId);
    }

    // 🧺 não existe carrinho → cria
    if (!cart) {
      await this.cartsRepository.create({
        userId,
        storeId,
      });

      // 🔁 rehidrata após criação
      cart = await this.cartsRepository.findLatestOpenCartByUser(userId);
    }

    if (!cart) {
      throw new Error("Erro ao criar ou recuperar carrinho");
    }

    // 🔒 SNAPSHOTS SEMPRE DEFINIDOS (NUNCA undefined)
    if (product.price === undefined) {
      throw new Error("Produto sem preço definido");
    }

    const priceSnapshot = new Decimal(product.price);

    const cashbackSnapshot = new Decimal(product.cashback_percentage ?? 0);

    // ➕ adiciona ou soma item
    const cartItem = await this.cartsRepository.addOrUpdateItem({
      cartId: cart.id,
      productId,
      quantity,
      priceSnapshot,
      cashbackSnapshot,
    });

    return {
      cartId: cart.id,
      item: cartItem,
    };
  }
}
*/
