import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { Cashback } from "@prisma/client";

interface GetUserCashbackHistoryUseCaseRequest {
  userId: string;
}

interface GetUserCashbackHistoryUseCaseResponse {
  cashbacks: Cashback[];
}

export class GetUserCashbackHistory {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({
    userId,
  }: GetUserCashbackHistoryUseCaseRequest): Promise<GetUserCashbackHistoryUseCaseResponse> {
    const cashbacks = await this.cashbacksRepository.findByUserId(userId);

    return {
      cashbacks,
    };
  }
}
