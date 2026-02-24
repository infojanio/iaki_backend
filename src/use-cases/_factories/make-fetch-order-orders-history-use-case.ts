import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FetchOrderOrdersHistoryUseCase } from "@/use-cases/orders/fetch-order-by-id-history";
export function makeFetchOrderOrdersHistoryUseCase() {
  const ordersRepository = new PrismaOrdersRepository();
  const useCase = new FetchOrderOrdersHistoryUseCase(ordersRepository);
  return useCase;
}
