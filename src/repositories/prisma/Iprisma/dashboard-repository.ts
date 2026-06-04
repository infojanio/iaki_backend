export interface DashboardSummaryDTO {
  todayOrders: number;
  weekOrders: number;
  pendingOrders: number;
  activeProducts: number;
  activeRewards: number;
  pendingRedemptions: number;
  confirmedRedemptions: number;
  totalUsers: number;

  ordersByMonth: {
    month: string;
    total: number;
  }[];

  topProducts: {
    id: string;
    name: string;
    totalSold: number;
  }[];

  topUsers: {
    id: string;
    name: string;
    email: string;
    totalPoints: number;
    totalRedemptions: number;
  }[];

  latestValidatedOrders: {
    id: string;
    totalAmount: number;
    userName: string;
    createdAt: Date;
  }[];

  latestPendingOrders: {
    id: string;
    totalAmount: number;
    userName: string;
    createdAt: Date;
  }[];
}

export interface DashboardRepository {
  getSummary(storeId?: string): Promise<DashboardSummaryDTO>;
}
