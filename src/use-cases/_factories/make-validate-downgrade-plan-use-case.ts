import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { PrismaStoreUsageRepository } from "@/repositories/prisma/store-usage-repository";
import { ValidateDowngradePlanUseCase } from "../plans/validate-downgrade-plan";

export function makeValidateDowngradePlanUseCase() {
  const plansRepository = new PrismaPlansRepository();
  const storeUsageRepository = new PrismaStoreUsageRepository();

  return new ValidateDowngradePlanUseCase(
    plansRepository,
    storeUsageRepository,
  );
}
