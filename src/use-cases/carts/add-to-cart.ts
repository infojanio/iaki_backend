import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { StoreNotAvailableInCityError } from "@/utils/messages/errors/store-not-available-in-city-error";
import { InsufficientStockError } from "@/utils/messages/errors/insufficient-stock-error";
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
    if (product.storeId !== storeId) {
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
      await this.cartsRepository.create({ userId, storeId });
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
    const cashbackSnapshot = product.cashbackPercentage ?? 0;

    // ===============================
    // 🔥🔥🔥 VALIDAÇÃO DE ESTOQUE 🔥🔥🔥
    // ===============================

    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    const quantityInCart = existingItem ? Number(existingItem.quantity) : 0;

    const totalStock = Number(product.quantity ?? 0);
    const availableStock = totalStock - quantityInCart;

    if (quantity > availableStock) {
      throw new InsufficientStockError(availableStock);
    }

    // ===============================
    // ➕ adiciona ou soma item
    // ===============================

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
