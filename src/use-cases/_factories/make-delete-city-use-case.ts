import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { DeleteCityUseCase } from "../cities/delete-city";

export function makeDeleteCityUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new DeleteCityUseCase(citiesRepository);

  return useCase;
}
