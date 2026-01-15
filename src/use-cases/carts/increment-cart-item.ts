import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";

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
    const cart = await this.cartsRepository.findOpenByUserAndStore(
      userId,
      storeId,
    );

    if (!cart) {
      throw new Error("Carrinho não encontrado.");
    }

    const item = cart.items.find((item) => item.productId === productId);

    if (!item) {
      throw new Error("Item não encontrado no carrinho.");
    }

    return this.cartsRepository.updateItemQuantity(
      cart.id,
      productId,
      item.quantity + 1,
    );
  }
}
