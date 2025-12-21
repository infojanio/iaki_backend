import { PrismaStatesRepository } from "@/repositories/prisma/prisma-states-repository";
import { DeleteStateUseCase } from "../states/delete-state";

export function makeDeleteStateUseCase() {
  const statesRepository = new PrismaStatesRepository();
  const useCase = new DeleteStateUseCase(statesRepository);

  return useCase;
}
