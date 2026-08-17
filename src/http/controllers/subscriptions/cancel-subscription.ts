import { makeCancelSubscriptionsUseCase } from "@/use-cases/_factories/make-cancel-subscriptions-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function cancelSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    subscriptionId: z.string().uuid("Assinatura inválida."),
  });

  const { subscriptionId } = paramsSchema.parse(request.params);

  const cancelSubscriptionUseCase = makeCancelSubscriptionsUseCase();

  await cancelSubscriptionUseCase.execute({
    subscriptionId,
  });

  return reply.status(200).send({
    message: "Assinatura cancelada com sucesso.",
  });
}
