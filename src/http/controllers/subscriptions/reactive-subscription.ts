// src/http/controllers/subscriptions/reactive-subscription.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeReactiveSubscriptionUseCase } from "@/use-cases/_factories/make-reactive-subscription-use-case";

export async function reactiveSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const useCase = makeReactiveSubscriptionUseCase();

  await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    message: "Assinatura reativada com sucesso.",
  });
}
