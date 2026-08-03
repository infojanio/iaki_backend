import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeListRewardsUseCase } from "@/use-cases/_factories/make-list-rewards-use-case";

export async function listRewardsByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid("Cidade inválida."),
  });

  const { cityId } = paramsSchema.parse(request.params);

  const useCase = makeListRewardsUseCase();

  const { rewards } = await useCase.execute({
    cityId,
  });

  return reply.status(200).send({
    rewards,
  });
}
