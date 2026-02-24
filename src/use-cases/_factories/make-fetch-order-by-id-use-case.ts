import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FetchOrderByIdHistoryUseCase } from "../orders/fetch-order-by-id-history";
import { prisma } from "@/lib/prisma";

export function makeFetchOrderByIdUseCase() {
  const ordersRepository = new PrismaOrdersRepository(prisma);
  return new FetchOrderByIdHistoryUseCase(ordersRepository);
}
