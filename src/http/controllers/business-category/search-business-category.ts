import { makeSearchBusinessCategoryUseCase } from "@/use-cases/_factories/make-search-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function searchBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    q: z.string().min(1),
  });

  try {
    const { q } = querySchema.parse(request.query);

    const useCase = makeSearchBusinessCategoryUseCase();
    const { categories } = await useCase.execute({ query: q });

    return reply.status(200).send(categories);
  } catch (error) {
    return reply.status(400).send({
      message: "Erro ao buscar categorias",
    });
  }
}
