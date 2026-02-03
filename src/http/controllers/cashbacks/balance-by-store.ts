// http/cashbacks/balance-by-store.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetCashbackBalanceByStoreUseCase } from "@/use-cases/_factories/make-get-cashback-balance-by-store-use-case";

export async function balanceByStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const useCase = makeGetCashbackBalanceByStoreUseCase();

  const { balance } = await useCase.execute({
    userId: request.user.sub,
    storeId,
  });

  return reply.status(200).send({ balance });
}
