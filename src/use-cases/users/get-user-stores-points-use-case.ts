import { StorePointsWalletRepository } from "@/repositories/prisma/Iprisma/store-points-wallet-repository";

interface GetUserStoresWithPointsRequest {
  userId: string;
}

export class GetUserStoresWithPointsUseCase {
  constructor(private walletRepository: StorePointsWalletRepository) {}

  async execute({ userId }: GetUserStoresWithPointsRequest) {
    const wallets = await this.walletRepository.findAllByUser(userId);

    return wallets.map((wallet) => ({
      storeId: wallet.store.id,
      storeName: wallet.store.name,
      balance: wallet.balance,
      earned: wallet.earned,
      spent: wallet.spent,
    }));
  }
}
