import { makeListPremiumReelsByCityUseCase } from "@/use-cases/_factories/make-list-premium-reels-by-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

export async function listPremiumReelsByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = paramsSchema.parse(request.params);

  const useCase = makeListPremiumReelsByCityUseCase();

  const { reels } = await useCase.execute({
    cityId,
  });

  return reply.status(200).send({
    reels,
  });
}
