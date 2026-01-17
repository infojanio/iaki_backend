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

    const itemExists = cart.items.some((item) => item.productId === productId);

    if (!itemExists) {
      throw new ResourceNotFoundError();
    }

    await this.cartsRepository.removeItemByCartAndProduct(cart.id, productId);

    // 🧹 se ficar vazio, limpa carrinho
    if (cart.items.length === 1) {
      await this.cartsRepository.clearCartByUserAndStore(userId, storeId);
    }
  }
}
