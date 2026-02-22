import { prisma } from "@/lib/prisma";
import { RedemptionStatus } from "@prisma/client";

export class ValidateStoreRewardRedemptionUseCase {
  async execute(params: { redemptionId: string; storeId: string }) {
    const { redemptionId, storeId } = params;

    return prisma.$transaction(async (tx) => {
      const result = await tx.storeRewardRedemption.updateMany({
        where: {
          id: redemptionId,
          storeId,
          status: RedemptionStatus.PENDING,
        },
        data: {
          status: RedemptionStatus.CONFIRMED,
          usedAt: new Date(),
        },
      });

      if (result.count === 0) {
        throw new Error(
          "Resgate inválido, já utilizado ou não pertence a esta loja.",
        );
      }

      return {
        redemptionId,
        status: "CONFIRMED",
      };
    });
  }
}
