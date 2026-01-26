import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";
import { makeCheckoutUseCase } from "@/use-cases/_factories/make-checkout-use-case";

export async function checkoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = bodySchema.parse(request.body);

  // 🔐 userId vem do JWT
  const userId = request.user.sub;

  try {
    const checkoutUseCase = makeCheckoutUseCase();

    const result = await checkoutUseCase.execute({
      userId,
      storeId,
    });

    return reply.status(201).send(result);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}
