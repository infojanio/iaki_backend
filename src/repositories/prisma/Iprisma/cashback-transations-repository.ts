import { CashbackTransactionType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

interface CreateCashbackTransactionDTO {
  userId: string;
  storeId: string;
  amount: Decimal;
  type: CashbackTransactionType;
  orderId?: string;
}

export interface CashbackTransactionsRepository {
  create(data: CreateCashbackTransactionDTO): Promise<void>;
}
