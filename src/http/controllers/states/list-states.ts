import { FastifyRequest, FastifyReply } from "fastify";
import { makeListStatesUseCase } from "@/use-cases/_factories/make-list-states-use-case";

export async function listStatesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const useCase = makeListStatesUseCase();
    const { states } = await useCase.execute();

    return reply.status(200).send(states);
  } catch {
    return reply.status(500).send({
      message: "Erro ao listar estados",
    });
  }
}
