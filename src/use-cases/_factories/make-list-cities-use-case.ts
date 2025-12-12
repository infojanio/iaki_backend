import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { ListCitiesUseCase } from "../cities/list-cities";

export function makeListCitiesUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new ListCitiesUseCase(citiesRepository);

  return useCase;
}
