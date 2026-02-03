// use-cases/_factories/make-get-cashback-balance-by-store-use-case.ts
import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { GetCashbackBalanceByStoreUseCase } from "../cashbacks/get-cashback-balance-by-store";

export function makeGetCashbackBalanceByStoreUseCase() {
  const cashbacksRepository = new PrismaCashbacksRepository();
  return new GetCashbackBalanceByStoreUseCase(cashbacksRepository);
}
