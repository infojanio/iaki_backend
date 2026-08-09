import { PrismaStoreAuditRepository } from "@/repositories/prisma/prisma-store-audit-repository";
import { GenerateStoreAuditReportUseCase } from "../reports/generate-store-audit-report";

export function makeGenerateStoreAuditReportUseCase() {
  const storeAuditRepository = new PrismaStoreAuditRepository();

  return new GenerateStoreAuditReportUseCase(storeAuditRepository);
}
