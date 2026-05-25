import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeUpdateStoreRewardUseCase } from "@/use-cases/_factories/make-update-store-reward-use-case";

export async function updateStoreReward(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    rewardId: z.string().uuid(),
  });

  const bodySchema = z.object({
    title: z.string().optional(),

    description: z.string().optional(),

    pointsCost: z.number().optional(),

    stock: z.number().optional(),

    image: z.string().optional(),

    expiresAt: z.coerce.date().optional(),

    maxPerUser: z.number().optional(),

    isActive: z.boolean().optional(),
  });

  const { rewardId } = paramsSchema.parse(request.params);

  const data = bodySchema.parse(request.body);

  const useCase = makeUpdateStoreRewardUseCase();

  const { reward } = await useCase.execute({
    rewardId,
    ...data,
  });

  return reply.status(200).send({
    data: reward,
  });
}
