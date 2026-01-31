import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";

interface GetOpenCartUseCaseRequest {
  userId: string;
}

interface GetOpenCartUseCaseResponse {
  id: string;
  storeId: string;
  storeName: string;
  itemsCount: number;
}

export class GetOpenCartUseCase {
  constructor(private cartsRepository: CartsRepository) {}

  async execute({
    userId,
  }: GetOpenCartUseCaseRequest): Promise<GetOpenCartUseCaseResponse | null> {
    const cart = await this.cartsRepository.findLatestOpenCartByUser(userId);

    if (!cart) {
      return null;
    }

    // 🔥 quantity já é number no domínio → não precisa Number()
    const itemsCount = cart.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      id: cart.id,
      storeId: cart.storeId,
      storeName: cart.store.name,
      itemsCount,
    };
  }
}
