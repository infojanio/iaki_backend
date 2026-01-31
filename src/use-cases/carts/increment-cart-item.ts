import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ProductsRepository } from "@/repositories/prisma/Iprisma/products-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { InsufficientStockError } from "@/utils/messages/errors/insufficient-stock-error";

interface IncrementCartItemUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
}

export class IncrementCartItemUseCase {
  constructor(
    private cartsRepository: CartsRepository,
    private productsRepository: ProductsRepository,
  ) {}

  async execute({
    userId,
    storeId,
    productId,
  }: IncrementCartItemUseCaseRequest) {
    const cart = await this.cartsRepository.findOpenByUserAndStoreWithItems(
      userId,
      storeId,
    );

    if (!cart) {
      throw new ResourceNotFoundError();
    }

    const cartItem = cart.items.find((item) => item.productId === productId);

    if (!cartItem) {
      throw new ResourceNotFoundError();
    }

    // 🔹 buscar produto
    const product = await this.productsRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundError();
    }

    const totalStock = Number(product.quantity ?? 0);
    const currentQuantity = Number(cartItem.quantity);

    if (currentQuantity + 1 > totalStock) {
      throw new InsufficientStockError(totalStock - currentQuantity);
    }

    // ✅ agora sim, incremento seguro
    await this.cartsRepository.updateItemQuantity({
      cartItemId: cartItem.id,
      quantity: currentQuantity + 1,
    });
  }
}
