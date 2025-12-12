import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface GetCityUseCaseRequest {
  id: string;
}

interface GetCityUseCaseResponse {
  city: City;
}

export class GetCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    id,
  }: GetCityUseCaseRequest): Promise<GetCityUseCaseResponse> {
    const city = await this.citiesRepository.findById(id);

    if (!city) {
      throw new Error("Cidade não encontrada!");
    }

    return { city };
  }
}
