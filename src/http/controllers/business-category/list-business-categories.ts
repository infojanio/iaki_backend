import { makeListBusinessCategoriesUseCase } from "@/use-cases/_factories/make-list-business-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function listBusinessCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const listBusinessCategoriesUseCase = makeListBusinessCategoriesUseCase();
    const { categories } = await listBusinessCategoriesUseCase.execute();

    return reply.status(200).send(categories);
  } catch (error) {
    console.error("Erro ao listar cidades:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
