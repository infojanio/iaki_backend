import { makeIncrementCartItemUseCase } from "@/use-cases/_factories/make-increment-cart-item-use-case";
import { InsufficientStockError } from "@/utils/messages/errors/insufficient-stock-error";
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

  try {
    const useCase = makeIncrementCartItemUseCase();
    await useCase.execute({ userId, storeId, productId });

    return reply.status(204).send();
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
