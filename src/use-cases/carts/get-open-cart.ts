import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";

interface GetOpenCartUseCaseRequest {
  userId: string;
}

interface GetOpenCartUseCaseResponse {
  id: string;
  storeId: string;
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

    const itemsCount = cart.items.reduce(
      (total, item) => total + Number(item.quantity),
      0,
    );

    return {
      id: cart.id,
      storeId: cart.storeId,
      itemsCount,
    };
  }
}
