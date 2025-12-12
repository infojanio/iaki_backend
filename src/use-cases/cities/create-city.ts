import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface CreateCityUseCaseRequest {
  id?: string;
  name: string;
  state: string;
}

interface CreateCityUseCaseResponse {
  city: City;
}

export class CreateCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    id,
    name,
    state,
  }: CreateCityUseCaseRequest): Promise<CreateCityUseCaseResponse> {
    // Verificar se cidade já existe
    const cityAlreadyExists = await this.citiesRepository.findByNameAndState(
      name,
      state,
    );

    if (cityAlreadyExists) {
      throw new Error("Esta cidade já está cadastrada!");
    }

    const city = await this.citiesRepository.create({
      id,
      name,
      state,
      createdAt: new Date(),
    });

    return { city };
  }
}
