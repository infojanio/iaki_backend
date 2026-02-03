import { PrismaOrdersRepository } from "@/repositories/prisma/prisma-orders-repository";
import { PrismaCashbackTransactionsRepository } from "@/repositories/prisma/prisma-cashback-transactions-repository";
import { ValidateOrderUseCase } from "../orders/validate-order";
import { prisma } from "@/lib/prisma";
import { PrismaCashbacksRepository } from "@/repositories/prisma/prisma-cashbacks-repository";
import { PrismaProductsRepository } from "@/repositories/prisma/prisma-products-repository";

export function makeValidateOrderUseCase() {
  const ordersRepository = new PrismaOrdersRepository(prisma);
  const cashbacksRepository = new PrismaCashbacksRepository();
  const productsRepository = new PrismaProductsRepository();

  const cashbackTransactionsRepository =
    new PrismaCashbackTransactionsRepository();

  const useCase = new ValidateOrderUseCase(
    ordersRepository,
    cashbacksRepository,
    cashbackTransactionsRepository,
    productsRepository,
  );

  return useCase;
}
