import { makeListPremiumBannersByCityUseCase } from "@/use-cases/_factories/make-list-premium-banners-by-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

export async function listPremiumBannersByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = paramsSchema.parse(request.params);

  const useCase = makeListPremiumBannersByCityUseCase();

  const { banners } = await useCase.execute({
    cityId,
  });

  return reply.status(200).send({
    banners,
  });
}
