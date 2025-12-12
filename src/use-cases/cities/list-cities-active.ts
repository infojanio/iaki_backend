import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface ListCitiesActiveUseCaseResponse {
  cities: City[];
}

export class ListCitiesActiveUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute(): Promise<ListCitiesActiveUseCaseResponse> {
    const cities = await this.citiesRepository.findManyActive();
    return { cities };
  }
}
