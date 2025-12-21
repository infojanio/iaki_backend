import { PrismaStatesRepository } from "@/repositories/prisma/prisma-states-repository";
import { CreateStateUseCase } from "../states/create-state";

export function makeCreateStateUseCase() {
  const statesRepository = new PrismaStatesRepository();
  const useCase = new CreateStateUseCase(statesRepository);

  return useCase;
}
