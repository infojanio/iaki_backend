import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckoutUseCase } from "@/use-cases/_factories/make-checkout-use-case";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

//todo pedido criado via app nasce do carrinho OPEN + snapshots → consistente.
export async function checkoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;

  try {
    const checkoutUseCase = makeCheckoutUseCase();

    const result = await checkoutUseCase.execute({
      userId,
    });

    return reply.status(201).send(result);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
