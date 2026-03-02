import { makeUpdateStateUseCase } from "@/use-cases/_factories/make-update-state-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function updateStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    stateId: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    uf: z.string().length(2).optional(),
  });

  try {
    const { stateId } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const useCase = makeUpdateStateUseCase();
    const { state } = await useCase.execute({ id: stateId, ...data });

    return reply.status(200).send(state);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao atualizar estado",
    });
  }
}
