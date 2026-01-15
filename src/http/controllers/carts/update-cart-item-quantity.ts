import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateCartItemQuantityUseCase } from "@/use-cases/_factories/make-update-cart-item-quantity-use-case";

export async function updateCartItemQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  const bodySchema = z.object({
    storeId: z.string().uuid(),
    cartItemId: z.string().uuid(),
    quantity: z.number().int().min(1),
  });

  const { storeId, cartItemId, quantity } = bodySchema.parse(request.body);

  const useCase = makeUpdateCartItemQuantityUseCase();

  await useCase.execute({
    userId,
    storeId,
    cartItemId,
    quantity,
  });

  return reply.status(200).send({
    message: "Quantidade atualizada com sucesso.",
  });
}
