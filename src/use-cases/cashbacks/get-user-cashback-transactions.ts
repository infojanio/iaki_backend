import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";

interface GetUserCashbackTransactionsRequest {
  userId: string;
}

export class GetUserCashbackTransactionsUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({ userId }: GetUserCashbackTransactionsRequest) {
    const transactions =
      await this.cashbacksRepository.getTransactionsByUserId(userId);
    return { transactions };
  }
}
