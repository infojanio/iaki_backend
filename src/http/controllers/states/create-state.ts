import { makeCreateStateUseCase } from "@/use-cases/_factories/make-create-state-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createStateController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().min(2),
    uf: z.string().length(2),
  });

  try {
    const data = bodySchema.parse(request.body);

    const useCase = makeCreateStateUseCase();
    const { state } = await useCase.execute(data);

    return reply.status(201).send(state);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(400).send({
      message: error.message ?? "Erro ao criar estado",
    });
  }
}
