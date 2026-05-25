import { FastifyReply, FastifyRequest } from "fastify";

import { makeListStoreRewardsUseCase } from "@/use-cases/_factories/make-list-store-rewards-use-case";

export async function listStoreRewards(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListStoreRewardsUseCase();

  const { rewards } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: rewards,
  });
}
