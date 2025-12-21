import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface CreateCityUseCaseRequest {
  id?: string;
  name: string;
  stateId: string;
}

interface CreateCityUseCaseResponse {
  city: City;
}

export class CreateCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    id,
    name,
    stateId,
  }: CreateCityUseCaseRequest): Promise<CreateCityUseCaseResponse> {
    // Verificar se cidade já existe
    const cityAlreadyExists = await this.citiesRepository.findByName(name);

    if (cityAlreadyExists) {
      throw new Error("Esta cidade já está cadastrada!");
    }

    const city = await this.citiesRepository.create({
      //id,
      name,
      stateId,
      createdAt: new Date(),
    });

    return { city };
  }
}
