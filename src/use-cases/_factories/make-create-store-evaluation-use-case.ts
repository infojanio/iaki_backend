import { PrismaStoreEvaluationsRepository } from "@/repositories/prisma/prisma-store-evaluations-repository";
import { PrismaStoresRepository } from "@/repositories/prisma/prisma-stores-repository";
import { CreateStoreEvaluationUseCase } from "../store-evaluations/create-store-evaluation-use-case";

export function makeCreateStoreEvaluationUseCase() {
  const storeEvaluationsRepository = new PrismaStoreEvaluationsRepository();

  const storesRepository = new PrismaStoresRepository();

  const useCase = new CreateStoreEvaluationUseCase(
    storeEvaluationsRepository,
    storesRepository,
  );

  return useCase;
}
