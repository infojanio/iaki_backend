import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { SearchCityUseCase } from "../cities/search-city";

export function makeSearchCityUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new SearchCityUseCase(citiesRepository);

  return useCase;
}
