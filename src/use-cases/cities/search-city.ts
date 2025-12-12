import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface SearchCityUseCaseRequest {
  query: string;
}

interface SearchCityUseCaseResponse {
  cities: City[];
}

export class SearchCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    query,
  }: SearchCityUseCaseRequest): Promise<SearchCityUseCaseResponse> {
    const cities = await this.citiesRepository.search(query);
    return { cities };
  }
}
