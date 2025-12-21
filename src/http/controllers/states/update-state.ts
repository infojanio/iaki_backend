import { makeUpdateStateUseCase } from "@/use-cases/_factories/make-update-state-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function updateStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    uf: z.string().length(2).optional(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const useCase = makeUpdateStateUseCase();
    const { state } = await useCase.execute({ id, ...data });

    return reply.status(200).send(state);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao atualizar estado",
    });
  }
}
