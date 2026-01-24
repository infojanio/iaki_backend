import { CartsRepository } from "@/repositories/prisma/Iprisma/carts-repository";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface UpdateUserCityUseCaseRequest {
  userId: string;
  cityId: string;
}

interface UpdateUserCityUseCaseResponse {
  user: any;
}

export class UpdateUserCityUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private cartsRepository: CartsRepository,
  ) {}

  async execute({
    userId,
    cityId,
  }: UpdateUserCityUseCaseRequest): Promise<UpdateUserCityUseCaseResponse> {
    // 1️⃣ Atualiza a cidade do usuário
    const user = await this.usersRepository.updateCity(userId, cityId);

    // 2️⃣ 🔥 FECHA TODOS OS CARRINHOS ABERTOS
    await this.cartsRepository.closeAllOpenCartsByUser(userId);

    return { user };
  }
}
