import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import {
  DashboardRepository,
  DashboardSummaryDTO,
} from "./Iprisma/dashboard-repository";

export class PrismaDashboardRepository implements DashboardRepository {
  async getSummary(storeId?: string): Promise<DashboardSummaryDTO> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const currentYear = new Date().getFullYear();

    const [
      todayOrders,
      weekOrders,
      pendingOrders,
      activeProducts,
      activeRewards,
      pendingRedemptions,
      confirmedRedemptions,
      totalUsers,
      ordersByMonthRaw,
      topProductsGrouped,

      topUsersGrouped,

      latestValidatedOrdersRaw,
      latestPendingOrdersRaw,
    ] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.order.count({
        where: {
          createdAt: { gte: weekAgo },
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.order.count({
        where: {
          status: "PENDING",
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.product.count({
        where: {
          status: true,
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.storeReward.count({
        where: {
          isActive: true,
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.storeRewardRedemption.count({
        where: {
          status: "PENDING",
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.storeRewardRedemption.count({
        where: {
          status: "CONFIRMED",
          ...(storeId ? { storeId } : {}),
        },
      }),

      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.$queryRaw<{ month: number; total: bigint }[]>(
        Prisma.sql`
          SELECT
            EXTRACT(MONTH FROM "created_at")::int AS month,
            COUNT(*)::bigint AS total
          FROM "orders"
          WHERE EXTRACT(YEAR FROM "created_at") = ${currentYear}
          ${storeId ? Prisma.sql`AND "store_id" = ${storeId}` : Prisma.empty}
          GROUP BY month
          ORDER BY month
        `,
      ),

      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: {
          quantity: true,
        },
        where: {
          order: {
            status: "VALIDATED",
            ...(storeId ? { storeId } : {}),
          },
        },
        orderBy: {
          _sum: {
            quantity: "desc",
          },
        },
        take: 5,
      }),

      prisma.storeRewardRedemption.groupBy({
        by: ["userId"],

        _count: {
          id: true,
        },

        where: {
          status: "CONFIRMED",

          ...(storeId ? { storeId } : {}),
        },

        orderBy: {
          _count: {
            id: "desc",
          },
        },

        take: 5,
      }),

      prisma.order.findMany({
        where: {
          status: "VALIDATED",
          ...(storeId ? { storeId } : {}),
        },
        take: 5,
        orderBy: {
          validatedAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      }),

      prisma.order.findMany({
        where: {
          status: "PENDING",
          ...(storeId ? { storeId } : {}),
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    const monthNames = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    const ordersByMonth = monthNames.map((month, index) => {
      const found = ordersByMonthRaw.find((item) => item.month === index + 1);

      return {
        month,
        total: Number(found?.total ?? 0),
      };
    });

    const productIds = topProductsGrouped.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const topProducts = topProductsGrouped.map((item) => ({
      id: item.productId,
      name:
        products.find((product) => product.id === item.productId)?.name ??
        "Produto removido",
      totalSold: Number(item._sum.quantity ?? 0),
    }));

    const userIds = topUsersGrouped.map((item) => item.userId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const topUsers = topUsersGrouped.map((item) => {
      const user = users.find((user) => user.id === item.userId);

      return {
        id: item.userId,
        name: user?.name ?? "Cliente removido",
        email: user?.email ?? "",
        totalPoints: 0, // implementar depois
        totalRedemptions: item._count.id,
      };
    });

    const latestValidatedOrders = latestValidatedOrdersRaw.map((order) => ({
      id: order.id,
      totalAmount: Number(order.totalAmount),
      userName: order.user?.name ?? "Cliente",
      createdAt: order.createdAt,
    }));

    const latestPendingOrders = latestPendingOrdersRaw.map((order) => ({
      id: order.id,
      totalAmount: Number(order.totalAmount),
      userName: order.user?.name ?? "Cliente",
      createdAt: order.createdAt,
    }));

    return {
      todayOrders,
      weekOrders,
      pendingOrders,
      activeProducts,
      activeRewards,
      pendingRedemptions,
      confirmedRedemptions,
      totalUsers,
      ordersByMonth,
      topProducts,
      topUsers,
      latestValidatedOrders,
      latestPendingOrders,
    };
  }
}
