// src/use-cases/redeem-store-reward-use-case.ts

import { prisma } from "@/lib/prisma";
import { RedemptionStatus, StorePointsTxType } from "@prisma/client";

export class RedeemStoreRewardUseCase {
  async execute(params: { userId: string; rewardId: string }) {
    const { userId, rewardId } = params;

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Buscar reward
      const reward = await tx.storeReward.findUnique({
        where: { id: rewardId },
      });

      if (!reward || !reward.isActive) {
        throw new Error("Brinde inválido ou inativo.");
      }

      if (reward.expiresAt && reward.expiresAt < new Date()) {
        throw new Error("Brinde expirado.");
      }

      if (reward.stock <= 0) {
        throw new Error("Brinde sem estoque.");
      }

      // 2️⃣ Buscar wallet
      const wallet = await tx.storePointsWallet.findUnique({
        where: {
          userId_storeId: {
            userId,
            storeId: reward.storeId,
          },
        },
      });

      if (!wallet) {
        throw new Error("Carteira não encontrada.");
      }

      if (wallet.balance < reward.pointsCost) {
        throw new Error("Pontos insuficientes.");
      }

      // 3️⃣ Atualizar wallet
      await tx.storePointsWallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: reward.pointsCost },
          spent: { increment: reward.pointsCost },
        },
      });

      // 4️⃣ Criar transação
      await tx.storePointsTransaction.create({
        data: {
          userId,
          storeId: reward.storeId,
          type: StorePointsTxType.SPEND,
          points: reward.pointsCost,
          note: `Resgate do brinde: ${reward.title}`,
          storePointsWalletId: wallet.id,
        },
      });

      // 5️⃣ Criar redemption
      const redemption = await tx.storeRewardRedemption.create({
        data: {
          rewardId,
          userId,
          storeId: reward.storeId,
          points: reward.pointsCost,
          status: RedemptionStatus.PENDING,
        },
      });

      // 6️⃣ Decrementar estoque
      await tx.storeReward.update({
        where: { id: rewardId },
        data: {
          stock: { decrement: 1 },
        },
      });

      return {
        redemptionId: redemption.id,
        storeId: reward.storeId,
      };
    });
  }
}
