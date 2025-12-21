import { makeListBusinessCategoriesByCityUseCase } from "@/use-cases/_factories/make-list-business-categories-by-city-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listBusinessCategoriesByCityController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  try {
    const { cityId } = paramsSchema.parse(request.params);

    const useCase = makeListBusinessCategoriesByCityUseCase();
    const { categories } = await useCase.execute({ cityId });

    return reply.status(200).send(categories);
  } catch {
    return reply.status(400).send({
      message: "Erro ao listar categorias da cidade",
    });
  }
}
