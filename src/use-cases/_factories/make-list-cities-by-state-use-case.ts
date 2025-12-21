import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { ListCitiesByStateUseCase } from "../cities/list-cities-by-state";

export function makeListCitiesByStateUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new ListCitiesByStateUseCase(citiesRepository);

  return useCase;
}
