import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

interface RemoveItemFromCartUseCaseRequest {
  userId: string;
  storeId: string;
  cartItemId: string;
}

export class RemoveItemFromCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
    storeId,
    cartItemId,
  }: RemoveItemFromCartUseCaseRequest) {
    // 🔎 busca carrinho OPEN da loja com itens
    const cart = await this.cartsRepository.findOpenByUserAndStoreWithItems(
      userId,
      storeId,
    );

    if (!cart) {
      throw new ResourceNotFoundError();
    }

    // 🔐 valida se o item pertence ao carrinho
    const itemExists = cart.items.some((item) => item.id === cartItemId);

    if (!itemExists) {
      throw new ResourceNotFoundError();
    }

    // 🗑 remove item
    await this.cartsRepository.removeItem(cartItemId);

    // 🧹 opcional: se carrinho ficar vazio, pode limpar
    if (cart.items.length === 1) {
      await this.cartsRepository.clearCart(cart.id);
    }
  }
}
