import { City } from "@prisma/client";
import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface ListCitiesByStateUseCaseRequest {
  stateId: string;
}

interface ListCitiesByStateUseCaseResponse {
  cities: City[];
}

export class ListCitiesByStateUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({
    stateId,
  }: ListCitiesByStateUseCaseRequest): Promise<ListCitiesByStateUseCaseResponse> {
    const cities = await this.citiesRepository.findByStateId(stateId);
    return { cities };
  }
}
