import { makeListBusinessCategoriesUseCase } from "@/use-cases/_factories/make-list-business-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function listBusinessCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListBusinessCategoriesUseCase();
    const { categories } = await useCase.execute();

    return reply.status(200).send(categories);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao listar categorias",
    });
  }
}
