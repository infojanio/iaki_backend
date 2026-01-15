import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetCartSummaryByStoreUseCase } from "@/use-cases/_factories/make-get-cart-summary-by-store-use-case";

export async function getCartSummaryByStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);
  const userId = request.user.sub;

  const useCase = makeGetCartSummaryByStoreUseCase();
  const summary = await useCase.execute({ userId, storeId });

  return reply.status(200).send(summary);
}
