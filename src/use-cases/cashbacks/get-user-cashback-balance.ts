import { CashbacksRepository } from "@/repositories/prisma/Iprisma/cashbacks-repository";
import { Decimal } from "@prisma/client/runtime/library";

interface GetUserCashbackBalanceUseCaseRequest {
  userId: string;
}

interface GetUserCashbackBalanceUseCaseResponse {
  totalReceived: number;
  totalUsed: number;
  balance: number;
}

export class GetUserCashbackBalanceUseCase {
  constructor(private cashbacksRepository: CashbacksRepository) {}

  async execute({
    userId,
  }: GetUserCashbackBalanceUseCaseRequest): Promise<GetUserCashbackBalanceUseCaseResponse> {
    const totalReceived = new Decimal(
      (await this.cashbacksRepository.totalCashbackByUserId(userId)) || 0,
    );

    const totalUsed = new Decimal(
      (await this.cashbacksRepository.totalUsedCashbackByUserId(userId)) || 0,
    );

    const balance = totalReceived.minus(totalUsed);

    return {
      totalReceived: totalReceived.toNumber(),
      totalUsed: totalUsed.toNumber(),
      balance: balance.toNumber(),
    };
  }
}
