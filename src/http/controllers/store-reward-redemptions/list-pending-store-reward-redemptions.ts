import { FastifyReply, FastifyRequest } from "fastify";

import { makeListPendingStoreRewardRedemptionsUseCase } from "@/use-cases/_factories/make-list-pending-store-reward-redemptions-use-case";

export async function listPendingStoreRewardRedemptions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListPendingStoreRewardRedemptionsUseCase();

  const { redemptions } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: redemptions,
  });
}
