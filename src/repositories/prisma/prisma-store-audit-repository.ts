import { prisma } from "@/lib/prisma";
import {
  StoreAuditData,
  StoreAuditRepository,
} from "./Iprisma/store-audit-repository";

export class PrismaStoreAuditRepository implements StoreAuditRepository {
  async getStoreAuditData(
    storeId: string,
    adminId: string,
    from?: Date,
    to?: Date,
  ): Promise<StoreAuditData | null> {
    const createdAtFilter =
      from || to
        ? {
            ...(from
              ? {
                  gte: from,
                }
              : {}),

            ...(to
              ? {
                  lte: to,
                }
              : {}),
          }
        : undefined;

    const [
      store,
      admin,
      orders,
      wallets,
      transactions,
      rewards,
      redemptions,
      products,
      subscription,
    ] = await Promise.all([
      prisma.store.findUnique({
        where: {
          id: storeId,
        },

        select: {
          id: true,
          name: true,
          cnpj: true,
          isActive: true,
          createdAt: true,

          city: {
            select: {
              name: true,

              state: {
                select: {
                  uf: true,
                },
              },
            },
          },
        },
      }),

      prisma.user.findFirst({
        where: {
          id: adminId,
          storeId,
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      }),

      prisma.order.findMany({
        where: {
          storeId,

          ...(createdAtFilter
            ? {
                createdAt: createdAtFilter,
              }
            : {}),
        },

        select: {
          id: true,
          userId: true,

          totalAmount: true,
          discountApplied: true,

          status: true,

          createdAt: true,
          validatedAt: true,

          user: {
            select: {
              name: true,
            },
          },

          storePointsTransactions: {
            where: {
              type: "EARN",
            },

            select: {
              id: true,
              points: true,
            },
          },
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.storePointsWallet.findMany({
        where: {
          storeId,
        },

        select: {
          id: true,
          userId: true,

          balance: true,
          earned: true,
          spent: true,

          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              name: true,
            },
          },
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.storePointsTransaction.findMany({
        where: {
          storeId,

          ...(createdAtFilter
            ? {
                createdAt: createdAtFilter,
              }
            : {}),
        },

        select: {
          id: true,
          userId: true,
          orderId: true,

          type: true,
          points: true,

          note: true,
          createdAt: true,

          user: {
            select: {
              name: true,
            },
          },
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.storeReward.findMany({
        where: {
          storeId,
        },

        select: {
          id: true,
          title: true,

          pointsCost: true,
          stock: true,

          isActive: true,

          expiresAt: true,
          createdAt: true,
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.storeRewardRedemption.findMany({
        where: {
          storeId,

          ...(createdAtFilter
            ? {
                createdAt: createdAtFilter,
              }
            : {}),
        },

        select: {
          id: true,

          rewardId: true,
          userId: true,

          points: true,

          status: true,

          createdAt: true,
          usedAt: true,

          reward: {
            select: {
              title: true,
            },
          },

          user: {
            select: {
              name: true,
            },
          },
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.product.findMany({
        where: {
          storeId,
        },

        select: {
          id: true,
          name: true,

          price: true,
          quantity: true,

          minStock: true,

          status: true,
          createdAt: true,
        },

        orderBy: [
          {
            createdAt: "asc",
          },
          {
            id: "asc",
          },
        ],
      }),

      prisma.subscription.findFirst({
        where: {
          storeId,
        },

        select: {
          id: true,

          status: true,

          startDate: true,
          endDate: true,

          isTrial: true,

          plan: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },

        orderBy: {
          endDate: "desc",
        },
      }),
    ]);

    if (!store) {
      return null;
    }

    return {
      store: {
        id: store.id,
        name: store.name,

        cnpj: store.cnpj,

        isActive: store.isActive,

        city: store.city.name,

        state: store.city.state.uf,
        createdAt: store.createdAt,
      },

      admin,

      orders: orders.map((order) => ({
        id: order.id,

        userId: order.userId,
        userName: order.user.name,

        totalAmount: Number(order.totalAmount),

        discountApplied: Number(order.discountApplied),

        status: order.status,

        createdAt: order.createdAt,

        validatedAt: order.validatedAt,

        pointsCredited: order.storePointsTransactions.reduce(
          (total, transaction) => total + transaction.points,
          0,
        ),

        pointsTransactionsCount: order.storePointsTransactions.length,
      })),

      wallets: wallets.map((wallet) => ({
        id: wallet.id,

        userId: wallet.userId,

        userName: wallet.user.name,

        balance: wallet.balance,

        earned: wallet.earned,

        spent: wallet.spent,

        createdAt: wallet.createdAt,

        updatedAt: wallet.updatedAt,
      })),

      transactions: transactions.map((transaction) => ({
        id: transaction.id,

        userId: transaction.userId,

        userName: transaction.user.name,

        orderId: transaction.orderId,

        type: transaction.type,

        points: transaction.points,

        note: transaction.note,

        createdAt: transaction.createdAt,
      })),

      rewards: rewards.map((reward) => ({
        ...reward,
      })),

      redemptions: redemptions.map((redemption) => ({
        id: redemption.id,

        rewardId: redemption.rewardId,

        rewardTitle: redemption.reward.title,

        userId: redemption.userId,

        userName: redemption.user.name,

        points: redemption.points,

        status: redemption.status,

        createdAt: redemption.createdAt,

        usedAt: redemption.usedAt,
      })),

      products: products.map((product) => ({
        id: product.id,

        name: product.name,

        price: Number(product.price),

        quantity: Number(product.quantity),

        minStock: product.minStock,

        status: product.status,
        createdAt: product.createdAt,
      })),

      subscription: subscription
        ? {
            id: subscription.id,

            status: subscription.status,

            startDate: subscription.startDate,

            endDate: subscription.endDate,

            isTrial: subscription.isTrial,

            plan: {
              id: subscription.plan.id,

              name: subscription.plan.name,

              price: Number(subscription.plan.price),
            },
          }
        : null,
    };
  }
}
