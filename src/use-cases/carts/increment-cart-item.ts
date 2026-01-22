import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface IncrementCartItemUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
}

export class IncrementCartItemUseCase {
  constructor(private cartsRepository: CartsRepository) {}

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

    // ✅ chamada correta (objeto)
    await this.cartsRepository.updateItemQuantity({
      cartItemId: cartItem.id,
      quantity: cartItem.quantity + 1,
    });
  }
}
