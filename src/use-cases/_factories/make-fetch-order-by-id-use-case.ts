import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { FetchOrderByIdUseCase } from "../orders/fetch-order-orders-history";
import { prisma } from "@/lib/prisma";

export function makeFetchOrderByIdUseCase() {
  const ordersRepository = new PrismaOrdersRepository(prisma);
  return new FetchOrderByIdUseCase(ordersRepository);
}
