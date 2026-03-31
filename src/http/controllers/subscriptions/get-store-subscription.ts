import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetStoreSubscriptionUseCase } from "@/use-cases/_factories/make-get-store-subscription-use-case";

export async function getStoreSubscription(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeGetStoreSubscriptionUseCase();

  try {
    const result = await useCase.execute({ storeId });

    return reply.status(200).send(result);
  } catch (error) {
    console.error("ERRO GET SUBSCRIPTION:", error);

    return reply.status(500).send({
      message: "Internal server error.",
    });
  }
}
