import { StoreRewardsRepository } from "@/repositories/prisma/Iprisma/store-rewards-repository";
import { StorePointsWalletRepository } from "@/repositories/prisma/Iprisma/store-points-wallet-repository";
import { StorePointsTransactionRepository } from "@/repositories/prisma/Iprisma/store-points-transaction-repository";

interface RedeemStoreRewardRequest {
  userId: string;
  storeId: string;
  rewardId: string;
}

export class RedeemStoreRewardUseCase {
  constructor(
    private rewardsRepository: StoreRewardsRepository,
    private walletRepository: StorePointsWalletRepository,
    private transactionRepository: StorePointsTransactionRepository,
  ) {}

  async execute({ userId, storeId, rewardId }: RedeemStoreRewardRequest) {
    const reward = await this.rewardsRepository.findById(rewardId);

    if (!reward) throw new Error("Brinde não encontrado.");
    if (reward.storeId !== storeId)
      throw new Error("Brinde inválido para esta loja.");
    if (!reward.isActive) throw new Error("Brinde indisponível.");
    if (reward.stock <= 0) throw new Error("Sem estoque.");

    const wallet = await this.walletRepository.findByUserAndStore(
      userId,
      storeId,
    );

    if (!wallet || wallet.balance < reward.pointsCost)
      throw new Error("Pontos insuficientes.");

    await this.walletRepository.decrementBalance(
      userId,
      storeId,
      reward.pointsCost,
    );

    await this.walletRepository.incrementSpent(
      userId,
      storeId,
      reward.pointsCost,
    );

    await this.transactionRepository.create({
      userId,
      storeId,
      type: "SPEND",
      points: reward.pointsCost,
      note: `Resgate: ${reward.title}`,
    });

    await this.rewardsRepository.decrementStock(rewardId);

    return { message: "Brinde resgatado com sucesso." };
  }
}
