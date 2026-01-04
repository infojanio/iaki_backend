export interface BusinessCategoryCityRepository {
  create(data: { businessCategoryId: string; cityId: string }): Promise<void>;
  findByCity(cityId: string): Promise<any[]>;
  delete(data: { businessCategoryId: string; cityId: string }): Promise<void>;
}
