import { PrismaDashboardRepository } from "@/repositories/prisma/prisma-dashboard-repository";

import { GetDashboardSummaryUseCase } from "../dashboard/get-dashboard-summary";

export function makeGetDashboardSummaryUseCase() {
  const repository = new PrismaDashboardRepository();

  return new GetDashboardSummaryUseCase(repository);
}
