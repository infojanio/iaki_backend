import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRemoveItemFromCartUseCase } from "@/use-cases/_factories/make-remove-item-from-cart-use-case";

export async function removeItemFromCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    cartItemId: z.string().uuid(),
  });

  const { storeId, cartItemId } = bodySchema.parse(request.body);

  const userId = request.user.sub;

  const removeItemFromCartUseCase = makeRemoveItemFromCartUseCase();

  await removeItemFromCartUseCase.execute({
    userId,
    storeId,
    cartItemId,
  });

  return reply.status(204).send();
}
