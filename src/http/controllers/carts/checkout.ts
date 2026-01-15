import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckoutUseCase } from "@/use-cases/_factories/make-checkout-use-case";

export async function checkoutController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = bodySchema.parse(request.body);
  const userId = request.user.sub;

  const checkoutUseCase = makeCheckoutUseCase();

  const result = await checkoutUseCase.execute({
    userId,
    storeId,
  });

  return reply.status(201).send(result);
}
