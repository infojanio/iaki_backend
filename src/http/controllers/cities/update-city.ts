import { makeUpdateCityUseCase } from "@/use-cases/_factories/make-update-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function updateCity(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cityId: z.string().uuid("ID inválido"),
  });

  const bodySchema = z.object({
    name: z.string().optional(),
    stateId: z.string().uuid().optional(),
  });

  try {
    const { cityId } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const useCase = makeUpdateCityUseCase();
    const { city } = await useCase.execute({ id: cityId, ...data });

    return reply.status(200).send(city);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "Erro de validação" });
    }

    return reply.status(404).send({ message: "Cidade não encontrada" });
  }
}
