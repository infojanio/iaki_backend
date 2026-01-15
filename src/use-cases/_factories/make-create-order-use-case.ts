import { CreateOrderUseCase } from "../orders/create-order";
import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { prisma } from "@/lib/prisma";

export function makeCreateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository(prisma);
  const cartsRepository = new PrismaCartsRepository(prisma);
  const cashbacksRepository = new PrismaCashbacksRepository();

  return new CreateOrderUseCase(
    ordersRepository,
    cartsRepository,
    cashbacksRepository,
  );
}
