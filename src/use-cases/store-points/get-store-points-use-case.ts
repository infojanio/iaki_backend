import { StorePointsWalletRepository } from "@/repositories/prisma/Iprisma/store-points-wallet-repository";

interface GetStorePointsUseCaseRequest {
  userId: string;
  storeId: string;
}

export class GetStorePointsUseCase {
  constructor(private walletRepository: StorePointsWalletRepository) {}

  async execute({ userId, storeId }: GetStorePointsUseCaseRequest) {
    const wallet = await this.walletRepository.findByUserAndStore(
      userId,
      storeId,
    );

    if (!wallet) {
      return {
        balance: 0,
        earned: 0,
        spent: 0,
        transactions: [],
      };
    }

    return {
      balance: wallet.balance ?? 0,
      earned: wallet.earned ?? 0,
      spent: wallet.spent ?? 0,
      transactions: wallet.transactions ?? [],
    };
  }
}
