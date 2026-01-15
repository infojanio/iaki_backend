import { makeGetCartByStoreUseCase } from "@/use-cases/_factories/make-get-cart-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getCartByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;

  const getCartByStoreUseCase = makeGetCartByStoreUseCase();

  const result = await getCartByStoreUseCase.execute({
    userId,
    storeId,
  });

  return reply.status(200).send(result);
}
