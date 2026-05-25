import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeApproveStoreRewardRedemptionUseCase } from "@/use-cases/_factories/make-approve-store-reward-redemption-use-case";

export async function approveStoreRewardRedemption(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    redemptionId: z.string().uuid(),
  });

  const { redemptionId } = paramsSchema.parse(request.params);

  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeApproveStoreRewardRedemptionUseCase();

  await useCase.execute({
    redemptionId,
    storeId,
  });

  return reply.status(200).send({
    message: "Resgate aprovado com sucesso.",
  });
}
