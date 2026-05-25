import { FastifyReply, FastifyRequest } from "fastify";

import { makeListConfirmedStoreRewardRedemptionsUseCase } from "@/use-cases/_factories/make-list-confirmed-store-reward-redemptions-use-case";

export async function listConfirmedStoreRewardRedemptions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListConfirmedStoreRewardRedemptionsUseCase();

  const { redemptions } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: redemptions,
  });
}
