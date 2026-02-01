import { OrdersRepository } from "./orders-repository";
import { CashbacksRepository } from "./cashbacks-repository";
import { CashbackTransactionsRepository } from "./cashback-transations-repository";

export interface TransactionRepositories {
  orders: OrdersRepository;
  cashbacks: CashbacksRepository;
  cashbackTransactions: CashbackTransactionsRepository;
}
