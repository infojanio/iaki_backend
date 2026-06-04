import { DashboardRepository } from "@/repositories/prisma/Iprisma/dashboard-repository";

interface Request {
  storeId?: string;
}

export class GetDashboardSummaryUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute({ storeId }: Request) {
    const summary = await this.dashboardRepository.getSummary(storeId);

    return {
      summary,
    };
  }
}
