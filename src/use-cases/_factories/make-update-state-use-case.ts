import { PrismaStatesRepository } from "@/repositories/prisma/prisma-states-repository";
import { UpdateStateUseCase } from "../states/update-state";

export function makeUpdateStateUseCase() {
  const statesRepository = new PrismaStatesRepository();
  const useCase = new UpdateStateUseCase(statesRepository);

  return useCase;
}
