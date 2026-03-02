import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetStateUseCase } from "@/use-cases/_factories/make-get-state-use-case";

export async function getState(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    stateId: z.string().uuid("ID inválido"),
  });

  try {
    const { stateId } = paramsSchema.parse(request.params);

    const getStateUseCase = makeGetStateUseCase();
    const { state } = await getStateUseCase.execute({ id: stateId });

    return reply.status(200).send(state);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "ID inválido" });
    }

    return reply.status(404).send({ message: "Estado não encontrada" });
  }
}
