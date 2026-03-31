import { FastifyReply, FastifyRequest } from "fastify";
import { makeCancelSubscriptionsUseCase } from "@/use-cases/_factories/make-cancel-subscriptions-use-case";

export async function cancelSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeCancelSubscriptionsUseCase();

  await useCase.execute({ storeId });

  return reply.status(200).send({
    message: "Assinatura cancelada com sucesso.",
  });
}
