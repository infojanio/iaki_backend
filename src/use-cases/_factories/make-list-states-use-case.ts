import { PrismaStatesRepository } from "@/repositories/prisma/prisma-states-repository";
import { ListStatesUseCase } from "../states/list-states";

export function makeListStatesUseCase() {
  const statesRepository = new PrismaStatesRepository();
  const useCase = new ListStatesUseCase(statesRepository);

  return useCase;
}
