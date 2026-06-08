import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetStoreSubscriptionUseCase } from "@/use-cases/_factories/make-get-store-subscription-use-case";
import { ExpiredSubscriptionError } from "@/utils/messages/errors/expired-subscription-error";

export async function getStoreSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const storeId = request.user.storeId;

    if (!storeId) {
      return reply.status(403).send({
        message: "Usuário não vinculado a uma loja.",
      });
    }

    console.log("store id:", storeId);

    const useCase = makeGetStoreSubscriptionUseCase();

    const result = await useCase.execute({
      storeId,
    });

    return reply.status(200).send(result);
  } catch (error) {
    if (error instanceof ExpiredSubscriptionError) {
      return reply.status(403).send({
        code: "SUBSCRIPTION_EXPIRED",
        message: error.message,
      });
    }

    console.error("ERRO GET SUBSCRIPTION:", error);

    return reply.status(500).send({
      message: "Erro ao buscar assinatura.",
    });
  }
}
