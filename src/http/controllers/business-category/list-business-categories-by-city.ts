import { makeListBusinessCategoriesByCityUseCase } from "@/use-cases/_factories/make-list-business-categories-by-city-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listBusinessCategoriesByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  const { cityId } = paramsSchema.parse(request.params);

  console.log("🔵 [Controller] cityId recebido:", cityId);

  const useCase = makeListBusinessCategoriesByCityUseCase();
  const { categories } = await useCase.execute({ cityId });

  console.log("🔵 [Controller] Total de categorias:", categories.length);

  return reply.status(200).send(categories);
}
