import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface DecrementCartItemUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
}

export class DecrementCartItemUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    storeId,
    productId,
  }: DecrementCartItemUseCaseRequest) {
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

    // 🔥 REGRA DE NEGÓCIO
    if (cartItem.quantity <= 1) {
      await this.cartsRepository.removeItem(cartItem.id);
      return;
    }

    // ✅ chamada correta (objeto)
    await this.cartsRepository.updateItemQuantity({
      cartItemId: cartItem.id,
      quantity: cartItem.quantity - 1,
    });
  }
}
