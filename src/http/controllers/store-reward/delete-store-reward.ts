import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeDeleteStoreRewardUseCase } from "@/use-cases/_factories/make-delete-store-reward-use-case";

export async function deleteStoreReward(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    rewardId: z.string().uuid(),
  });

  const { rewardId } = paramsSchema.parse(request.params);

  const useCase = makeDeleteStoreRewardUseCase();

  await useCase.execute({
    rewardId,
  });

  return reply.status(204).send();
}
