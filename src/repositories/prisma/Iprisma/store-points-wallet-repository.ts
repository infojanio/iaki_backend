export interface StorePointsWalletRepository {
  findByUserAndStore(userId: string, storeId: string): Promise<any | null>;
  findAllByUser(userId: string): Promise<any[]>;

  decrementBalance(
    userId: string,
    storeId: string,
    points: number,
  ): Promise<void>;

  incrementSpent(
    userId: string,
    storeId: string,
    points: number,
  ): Promise<void>;
}
