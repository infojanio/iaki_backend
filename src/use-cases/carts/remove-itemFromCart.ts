import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface RemoveItemFromCartUseCaseRequest {
  userId: string;
  storeId: string;
  productId: string;
}

export class RemoveItemFromCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    storeId,
    productId,
  }: RemoveItemFromCartUseCaseRequest) {
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

    // ✅ remove pelo cartItemId (forma correta)
    await this.cartsRepository.removeItem(cartItem.id);
  }
}
