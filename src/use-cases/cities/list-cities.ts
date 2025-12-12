import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface ListCitiesUseCaseResponse {
  cities: City[];
}

export class ListCitiesUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute(): Promise<ListCitiesUseCaseResponse> {
    const cities = await this.citiesRepository.findMany();
    return { cities };
  }
}
