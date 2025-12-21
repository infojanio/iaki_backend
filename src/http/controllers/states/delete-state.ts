import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeDeleteStateUseCase } from "@/use-cases/_factories/make-delete-state-use-case";

export async function deleteStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeleteStateUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch {
    return reply.status(404).send({
      message: "Estado não encontrado",
    });
  }
}
