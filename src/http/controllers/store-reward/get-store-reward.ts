import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeGetStoreRewardUseCase } from "@/use-cases/_factories/make-get-store-reward-use-case";

export async function getStoreReward(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    rewardId: z.string().uuid(),
  });

  const { rewardId } = paramsSchema.parse(request.params);

  const useCase = makeGetStoreRewardUseCase();

  const { reward } = await useCase.execute({
    rewardId,
  });

  return reply.status(200).send({
    data: reward,
  });
}
