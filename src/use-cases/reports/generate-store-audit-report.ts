import { StoreAuditRepository } from "@/repositories/prisma/Iprisma/store-audit-repository";
import { createHash } from "node:crypto";

interface GenerateStoreAuditReportRequest {
  storeId: string;
  adminId: string;

  from?: Date;
  to?: Date;
}

export class StoreNotFoundError extends Error {
  constructor() {
    super("Loja não encontrada.");
  }
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

export class GenerateStoreAuditReportUseCase {
  constructor(private storeAuditRepository: StoreAuditRepository) {}

  async execute({
    storeId,
    adminId,
    from,
    to,
  }: GenerateStoreAuditReportRequest) {
    const data = await this.storeAuditRepository.getStoreAuditData(
      storeId,
      adminId,
      from,
      to,
    );

    if (!data) {
      throw new StoreNotFoundError();
    }

    /*
     * ============================
     * PEDIDOS
     * ============================
     */

    const validatedOrders = data.orders.filter(
      (order) => order.status === "VALIDATED",
    );

    const pendingOrders = data.orders.filter(
      (order) => order.status === "PENDING",
    );

    const expiredOrders = data.orders.filter(
      (order) => order.status === "EXPIRED",
    );

    /*
     * A regra atual do IAki:
     *
     * 1 ponto para cada R$ 10,00
     * efetivamente pagos.
     */
    const ordersWithAudit = data.orders.map((order) => {
      const expectedPoints =
        order.status === "VALIDATED"
          ? Math.floor(Math.max(order.totalAmount, 0) / 10)
          : 0;

      return {
        ...order,

        expectedPoints,

        pointsDifference: order.pointsCredited - expectedPoints,
      };
    });

    /*
     * ============================
     * TRANSAÇÕES
     * ============================
     */

    const earnTransactions = data.transactions.filter(
      (transaction) => transaction.type === "EARN",
    );

    const spendTransactions = data.transactions.filter(
      (transaction) => transaction.type === "SPEND",
    );

    const adjustTransactions = data.transactions.filter(
      (transaction) => transaction.type === "ADJUST",
    );

    /*
     * ============================
     * RESGATES
     * ============================
     */

    const confirmedRedemptions = data.redemptions.filter(
      (redemption) => redemption.status === "CONFIRMED",
    );

    const pendingRedemptions = data.redemptions.filter(
      (redemption) => redemption.status === "PENDING",
    );

    const canceledRedemptions = data.redemptions.filter(
      (redemption) => redemption.status === "CANCELED",
    );

    /*
     * ============================
     * CLIENTES
     * ============================
     */

    const customerIds = new Set<string>();

    data.orders.forEach((order) => customerIds.add(order.userId));

    data.wallets.forEach((wallet) => customerIds.add(wallet.userId));

    data.redemptions.forEach((redemption) =>
      customerIds.add(redemption.userId),
    );

    /*
     * ============================
     * RESUMO
     * ============================
     */

    const summary = {
      customers: {
        total: customerIds.size,
      },

      orders: {
        total: data.orders.length,

        pending: pendingOrders.length,

        validated: validatedOrders.length,

        expired: expiredOrders.length,

        totalAmount: roundMoney(
          data.orders.reduce((total, order) => total + order.totalAmount, 0),
        ),

        validatedAmount: roundMoney(
          validatedOrders.reduce(
            (total, order) => total + order.totalAmount,
            0,
          ),
        ),

        pointsExpected: ordersWithAudit.reduce(
          (total, order) => total + order.expectedPoints,
          0,
        ),

        pointsCredited: ordersWithAudit.reduce(
          (total, order) => total + order.pointsCredited,
          0,
        ),
      },

      wallets: {
        total: data.wallets.length,

        balance: data.wallets.reduce(
          (total, wallet) => total + wallet.balance,
          0,
        ),

        earned: data.wallets.reduce(
          (total, wallet) => total + wallet.earned,
          0,
        ),

        spent: data.wallets.reduce((total, wallet) => total + wallet.spent, 0),
      },

      transactions: {
        total: data.transactions.length,

        earnCount: earnTransactions.length,

        earnPoints: earnTransactions.reduce(
          (total, transaction) => total + transaction.points,
          0,
        ),

        spendCount: spendTransactions.length,

        spendPoints: spendTransactions.reduce(
          (total, transaction) => total + transaction.points,
          0,
        ),

        adjustCount: adjustTransactions.length,

        adjustPoints: adjustTransactions.reduce(
          (total, transaction) => total + transaction.points,
          0,
        ),
      },

      rewards: {
        total: data.rewards.length,

        active: data.rewards.filter((reward) => reward.isActive).length,

        stock: data.rewards.reduce((total, reward) => total + reward.stock, 0),
      },

      redemptions: {
        total: data.redemptions.length,

        pending: pendingRedemptions.length,

        confirmed: confirmedRedemptions.length,

        canceled: canceledRedemptions.length,

        confirmedPoints: confirmedRedemptions.reduce(
          (total, redemption) => total + redemption.points,
          0,
        ),
      },

      products: {
        total: data.products.length,

        active: data.products.filter((product) => product.status).length,

        stock: data.products.reduce(
          (total, product) => total + product.quantity,
          0,
        ),
      },
    };

    /*
     * ============================
     * INTEGRIDADE
     * ============================
     */

    const validatedWithoutDate = ordersWithAudit.filter(
      (order) => order.status === "VALIDATED" && !order.validatedAt,
    );

    const pointMismatchOrders = ordersWithAudit.filter(
      (order) =>
        order.status === "VALIDATED" &&
        order.pointsCredited !== order.expectedPoints,
    );

    const duplicateEarnOrders = ordersWithAudit.filter(
      (order) => order.pointsTransactionsCount > 1,
    );

    const nonValidatedWithPoints = ordersWithAudit.filter(
      (order) => order.status !== "VALIDATED" && order.pointsCredited !== 0,
    );

    const confirmedWithoutUsedAt = confirmedRedemptions.filter(
      (redemption) => !redemption.usedAt,
    );

    const pendingWithUsedAt = pendingRedemptions.filter(
      (redemption) => redemption.usedAt !== null,
    );

    const negativeWallets = data.wallets.filter((wallet) => wallet.balance < 0);

    const negativeRewardStock = data.rewards.filter(
      (reward) => reward.stock < 0,
    );

    const negativeProductStock = data.products.filter(
      (product) => product.quantity < 0,
    );

    /*
     * A comparação balance =
     * earned - spent só é segura
     * quando o usuário nunca teve
     * transação ADJUST.
     */
    const usersWithAdjust = new Set(
      adjustTransactions.map((transaction) => transaction.userId),
    );

    const inconsistentWallets = data.wallets.filter((wallet) => {
      if (usersWithAdjust.has(wallet.userId)) {
        return false;
      }

      return wallet.balance !== wallet.earned - wallet.spent;
    });

    const integrity = {
      totalIssues:
        validatedWithoutDate.length +
        pointMismatchOrders.length +
        duplicateEarnOrders.length +
        nonValidatedWithPoints.length +
        confirmedWithoutUsedAt.length +
        pendingWithUsedAt.length +
        negativeWallets.length +
        negativeRewardStock.length +
        negativeProductStock.length +
        inconsistentWallets.length,

      validatedWithoutDate: validatedWithoutDate.length,

      pointMismatchOrders: pointMismatchOrders.length,

      duplicateEarnOrders: duplicateEarnOrders.length,

      nonValidatedWithPoints: nonValidatedWithPoints.length,

      confirmedWithoutUsedAt: confirmedWithoutUsedAt.length,

      pendingWithUsedAt: pendingWithUsedAt.length,

      negativeWallets: negativeWallets.length,

      inconsistentWallets: inconsistentWallets.length,

      negativeRewardStock: negativeRewardStock.length,

      negativeProductStock: negativeProductStock.length,

      details: {
        pointMismatchOrders: pointMismatchOrders.map((order) => ({
          orderId: order.id,

          totalAmount: order.totalAmount,

          expectedPoints: order.expectedPoints,

          creditedPoints: order.pointsCredited,

          difference: order.pointsDifference,
        })),

        duplicateEarnOrders: duplicateEarnOrders.map((order) => ({
          orderId: order.id,

          earnTransactions: order.pointsTransactionsCount,
        })),

        inconsistentWallets: inconsistentWallets.map((wallet) => ({
          walletId: wallet.id,

          userId: wallet.userId,

          balance: wallet.balance,

          expectedBalance: wallet.earned - wallet.spent,
        })),
      },
    };

    /*
     * ============================
     * FINGERPRINT
     * ============================
     *
     * generatedAt e ADMIN não entram.
     *
     * Assim gerar novamente o relatório
     * sobre o mesmo estado deve produzir
     * a mesma assinatura.
     */

    const auditVersion = "IAKI-AUDIT-1";

    const fingerprintData = {
      auditVersion,

      store: data.store,

      period: {
        from: from?.toISOString() ?? null,

        to: to?.toISOString() ?? null,
      },

      orders: ordersWithAudit,

      wallets: data.wallets,

      transactions: data.transactions,

      rewards: data.rewards,

      redemptions: data.redemptions,

      products: data.products,

      subscription: data.subscription,

      summary,

      integrity,
    };

    const fingerprint = createHash("sha256")
      .update(JSON.stringify(fingerprintData))
      .digest("hex");

    return {
      report: {
        auditVersion,

        generatedAt: new Date(),

        period: {
          from: from ?? null,

          to: to ?? null,
        },

        store: data.store,

        generatedBy: data.admin,

        subscription: data.subscription,

        summary,

        integrity,

        orders: ordersWithAudit,

        wallets: data.wallets,

        transactions: data.transactions,

        rewards: data.rewards,

        redemptions: data.redemptions,

        products: data.products,

        fingerprint,
      },
    };
  }
}

export type StoreAuditReport = Awaited<
  ReturnType<GenerateStoreAuditReportUseCase["execute"]>
>["report"];
