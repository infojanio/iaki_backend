import { makeDeleteCityUseCase } from "@/use-cases/_factories/make-delete-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function deleteCity(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid("ID inválido"),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeleteCityUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "ID inválido" });
    }

    return reply.status(404).send({ message: "Cidade não encontrada" });
  }
}
