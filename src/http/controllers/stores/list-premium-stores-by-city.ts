import { makeListPremiumStoresByCityUseCase } from "@/use-cases/_factories/make-list-premium-stores-by-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function listPremiumStoresByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = paramsSchema.parse(request.params);

  const useCase = makeListPremiumStoresByCityUseCase();

  const { stores } = await useCase.execute({
    cityId,
  });

  return reply.status(200).send({
    stores,
  });
}
