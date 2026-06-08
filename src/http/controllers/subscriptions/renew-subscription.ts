import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeRenewSubscriptionUseCase } from "@/use-cases/_factories/make-renew-subscription-use-case";

export async function renewSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    subscriptionId: z.string().uuid(),
  });

  const { subscriptionId } = paramsSchema.parse(request.params);

  const useCase = makeRenewSubscriptionUseCase();

  await useCase.execute({
    subscriptionId,
  });

  return reply.status(200).send({
    message: "Assinatura renovada por mais 30 dias.",
  });
}
