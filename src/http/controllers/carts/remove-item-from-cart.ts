import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRemoveItemFromCartUseCase } from "@/use-cases/_factories/make-remove-item-from-cart-use-case";

export async function removeItemFromCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // 🔹 productId vem da URL
  const paramsSchema = z.object({
    productId: z.string().uuid(),
  });

  // 🔹 storeId vem do body
  const bodySchema = z.object({
    storeId: z.string().uuid(),
  });

  const { productId } = paramsSchema.parse(request.params);
  const { storeId } = bodySchema.parse(request.body);

  const userId = request.user.sub;

  const removeItemFromCartUseCase = makeRemoveItemFromCartUseCase();

  await removeItemFromCartUseCase.execute({
    userId,
    storeId,
    productId,
  });

  return reply.status(204).send();
}
