import { makeCreateCityUseCase } from "@/use-cases/_factories/make-create-city-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createCity(request: FastifyRequest, reply: FastifyReply) {
  const createCityBodySchema = z.object({
    name: z.string().min(2, "O nome da cidade é obrigatório"),
    state: z.string().min(2, "O estado é obrigatório"),
  });

  try {
    const data = createCityBodySchema.parse(request.body);

    const createCityUseCase = makeCreateCityUseCase();
    const { city } = await createCityUseCase.execute(data);

    return reply.status(201).send(city);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("Erro ao criar cidade:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
