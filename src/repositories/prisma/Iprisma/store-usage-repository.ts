export interface StoreUsageRepository {
  countProductsByStoreId(storeId: string): Promise<number>;
  countBannersByStoreId(storeId: string): Promise<number>;
  countReelsByStoreId(storeId: string): Promise<number>;
  countCategoriesByStoreId(storeId: string): Promise<number>;
}
