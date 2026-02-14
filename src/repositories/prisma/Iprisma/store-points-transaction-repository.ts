export interface StorePointsTransactionRepository {
  create(data: {
    userId: string;
    storeId: string;
    type: "SPEND";
    points: number;
    note?: string;
  }): Promise<void>;
}
