import { makeGetCityUseCase } from "@/use-cases/_factories/make-get-city-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getCity(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    cityId: z.string().uuid("ID inválido"),
  });

  try {
    const { cityId } = paramsSchema.parse(request.params);

    const getCityUseCase = makeGetCityUseCase();
    const { city } = await getCityUseCase.execute({ id: cityId });

    return reply.status(200).send(city);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ message: "ID inválido" });
    }

    return reply.status(404).send({ message: "Cidade não encontrada" });
  }
}
