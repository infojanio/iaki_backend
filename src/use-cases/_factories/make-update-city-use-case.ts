import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { UpdateCityUseCase } from "../cities/update-city";

export function makeUpdateCityUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new UpdateCityUseCase(citiesRepository);

  return useCase;
}
