import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { GetCityUseCase } from "../cities/get-city";

export function makeGetCityUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new GetCityUseCase(citiesRepository);

  return useCase;
}
