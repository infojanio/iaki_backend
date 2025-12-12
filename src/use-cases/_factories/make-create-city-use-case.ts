import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { CreateCityUseCase } from "../cities/create-city";

export function makeCreateCityUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new CreateCityUseCase(citiesRepository);

  return useCase;
}
