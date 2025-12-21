import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetStateUseCase } from "@/use-cases/_factories/make-get-state-use-case";

export async function getStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeGetStateUseCase();
    const { state } = await useCase.execute({ id });

    return reply.status(200).send(state);
  } catch {
    return reply.status(404).send({
      message: "Estado não encontrado",
    });
  }
}
