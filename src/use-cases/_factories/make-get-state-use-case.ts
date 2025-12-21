import { PrismaStatesRepository } from "@/repositories/prisma/prisma-states-repository";
import { GetStateUseCase } from "../states/get-state";

export function makeGetStateUseCase() {
  const statesRepository = new PrismaStatesRepository();
  const useCase = new GetStateUseCase(statesRepository);

  return useCase;
}
