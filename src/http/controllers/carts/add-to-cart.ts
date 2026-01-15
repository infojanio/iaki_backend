import { makeAddToCartUseCase } from "@/use-cases/_factories/make-add-to-cart-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function addToCartController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    productId: z.string().uuid(),
    quantity: z.number().int().min(1),
  });

  const { storeId, productId, quantity } = bodySchema.parse(request.body);

  const userId = request.user.sub;

  const addToCartUseCase = makeAddToCartUseCase();

  const result = await addToCartUseCase.execute({
    userId,
    storeId,
    productId,
    quantity,
  });

  return reply.status(201).send(result);
}
