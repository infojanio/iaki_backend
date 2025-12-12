import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface UpdateCityUseCaseRequest {
  id: string;
  name?: string;
  state?: string;
}

interface UpdateCityUseCaseResponse {
  city: City;
}

export class UpdateCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    id,
    name,
    state,
  }: UpdateCityUseCaseRequest): Promise<UpdateCityUseCaseResponse> {
    const cityExists = await this.citiesRepository.findById(id);

    if (!cityExists) {
      throw new Error("Cidade não encontrada!");
    }

    const city = await this.citiesRepository.update(id, {
      name,
      state,
    });

    return { city };
  }
}
