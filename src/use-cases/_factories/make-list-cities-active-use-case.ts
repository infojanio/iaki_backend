import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { ListCitiesActiveUseCase } from "../cities/list-cities-active";

export function makeListCitiesActiveUseCase() {
  const citiesRepository = new PrismaCitiesRepository();
  const useCase = new ListCitiesActiveUseCase(citiesRepository);

  return useCase;
}
