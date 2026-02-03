// use-cases/cashbacks/get-cashback-balance-by-store.ts
import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";

interface GetCashbackBalanceByStoreRequest {
  userId: string;
  storeId: string;
}

export class GetCashbackBalanceByStoreUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({ userId, storeId }: GetCashbackBalanceByStoreRequest) {
    const balance = await this.cashbacksRepository.getBalanceByStore(
      userId,
      storeId,
    );

    return { balance };
  }
}
