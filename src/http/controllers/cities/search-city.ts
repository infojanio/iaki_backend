import { makeSearchCityUseCase } from "@/use-cases/_factories/make-search-city-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function searchCity(request: FastifyRequest, reply: FastifyReply) {
  const searchSchema = z.object({
    query: z.string().min(1, "A busca não pode estar vazia"),
  });

  try {
    const { query } = searchSchema.parse(request.query);

    const useCase = makeSearchCityUseCase();
    const { cities } = await useCase.execute({ query });

    return reply.status(200).send(cities);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("Erro ao buscar cidades:", error);
    return reply.status(500).send({ message: "Erro interno no servidor" });
  }
}
