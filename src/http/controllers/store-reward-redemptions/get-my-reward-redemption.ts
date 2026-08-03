import { makeGetMyRewardRedemptionUseCase } from "@/use-cases/_factories/make-get-my-reward-redemption-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

export async function getMyRewardRedemption(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    redemptionId: z.string().uuid("Identificador do resgate inválido."),
  });

  const { redemptionId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;

  const useCase = makeGetMyRewardRedemptionUseCase();

  const { redemption } = await useCase.execute({
    redemptionId,
    userId,
  });

  if (!redemption) {
    return reply.status(404).send({
      message: "Resgate não encontrado.",
    });
  }

  return reply.status(200).send({
    redemption,
  });
}
