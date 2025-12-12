import { makeListCitiesActiveUseCase } from "@/use-cases/_factories/make-list-cities-active-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function listCitiesActive(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListCitiesActiveUseCase();
    const { cities } = await useCase.execute();

    return reply.status(200).send(cities);
  } catch (error) {
    console.error("Erro ao listar cidades ativas:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
