import { z } from "zod";
import { makeLinkBusinessCategoryToCityUseCase } from "@/use-cases/_factories/make-link-business-category-to-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function linkBusinessCategoryToCityController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    businessCategoryId: z.string().uuid(),
    cityId: z.string().uuid(),
  });

  const { businessCategoryId, cityId } = bodySchema.parse(request.body);

  const useCase = makeLinkBusinessCategoryToCityUseCase();
  await useCase.execute({ businessCategoryId, cityId });

  return reply.status(201).send();
}
