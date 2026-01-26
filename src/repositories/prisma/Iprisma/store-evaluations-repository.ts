import { StoreEvaluation } from "@prisma/client";

export interface StoreEvaluationsRepository {
  findByUserAndStore(
    userId: string,
    storeId: string,
  ): Promise<StoreEvaluation | null>;

  create(data: {
    userId: string;
    storeId: string;
    rating: number;
  }): Promise<StoreEvaluation>;
}
