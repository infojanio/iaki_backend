import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface UpdateUserCityUseCaseRequest {
  userId: string;
  cityId: string;
}

export class UpdateUserCityUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private citiesRepository: CitiesRepository,
  ) {}

  async execute({ userId, cityId }: UpdateUserCityUseCaseRequest) {
    const city = await this.citiesRepository.findById(cityId);
    if (!city) {
      throw new Error("Cidade inválida");
    }

    const user = await this.usersRepository.updateCity(userId, cityId);

    return { user };
  }
}
