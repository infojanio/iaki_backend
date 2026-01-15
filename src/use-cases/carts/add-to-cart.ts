import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

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
    // 🔹 valida produto
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    // 🔹 segurança: produto deve pertencer à loja
    if (product.store_id !== storeId) {
      throw new Error("Produto não pertence à loja selecionada");
    }

    // 🔹 busca carrinho OPEN da loja
    let cart = await this.cartsRepository.findOpenByUserAndStore(
      userId,
      storeId,
    );

    // 🔹 cria carrinho se não existir
    if (!cart) {
      cart = await this.cartsRepository.create({
        userId,
        storeId,
      });
    }

    // 🔹 adiciona ou atualiza item com snapshot
    const cartItem = await this.cartsRepository.addOrUpdateItem({
      cartId: cart.id,
      productId,
      quantity,
      priceSnapshot: product.price,
      cashbackSnapshot: product.cashback_percentage,
    });

    return {
      cartId: cart.id,
      item: cartItem,
    };
  }
}
