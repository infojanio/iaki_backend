import { makeListStoreBusinessCategoriesUseCase } from "@/use-cases/_factories/make-list-store-business-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function listStoreBusinessCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListStoreBusinessCategoriesUseCase();
    const { relations } = await useCase.execute();

    return reply.status(200).send(relations);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao listar relações loja-categoria",
    });
  }
}
