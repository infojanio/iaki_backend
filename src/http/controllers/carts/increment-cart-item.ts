import { makeIncrementCartItemUseCase } from "@/use-cases/_factories/make-increment-cart-item-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function incrementCartItem(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  const bodySchema = z.object({
    storeId: z.string().uuid(),
    productId: z.string().uuid(),
  });

  const { storeId, productId } = bodySchema.parse(request.body);

  const useCase = makeIncrementCartItemUseCase();
  await useCase.execute({ userId, storeId, productId });

  return reply.status(204).send();
}
