import { makeListCitiesByStateUseCase } from "@/use-cases/_factories/make-list-cities-by-state-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listCitiesByStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    stateId: z.string().uuid(),
  });

  try {
    const { stateId } = paramsSchema.parse(request.params);

    const useCase = makeListCitiesByStateUseCase();
    const { cities } = await useCase.execute({ stateId });

    return reply.status(200).send(cities);
  } catch {
    return reply.status(400).send({
      message: "Erro ao listar cidades do estado",
    });
  }
}
