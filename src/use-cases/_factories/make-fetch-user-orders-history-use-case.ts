import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FetchUserOrdersHistoryUseCase } from "../orders/fetch-user-orders-history";
import { prisma } from "@/lib/prisma";

export function makeFetchUserOrdersHistoryUseCase() {
  const ordersRepository = new PrismaOrdersRepository(prisma);
  return new FetchUserOrdersHistoryUseCase(ordersRepository);
}
