import { makeListCitiesUseCase } from "@/use-cases/_factories/make-list-cities-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function listCities(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listCitiesUseCase = makeListCitiesUseCase();
    const { cities } = await listCitiesUseCase.execute();

    return reply.status(200).send(cities);
  } catch (error) {
    console.error("Erro ao listar cidades:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
