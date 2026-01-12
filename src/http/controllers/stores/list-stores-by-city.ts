import { makeListStoresByCityUseCase } from "@/use-cases/_factories/make-list-stores-by-city";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listStoresByCity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
  });

  try {
    console.log("🟣 [Controller] params recebidos:", request.params);
    const { cityId } = paramsSchema.parse(request.params);

    const useCase = makeListStoresByCityUseCase();
    const { stores } = await useCase.execute({ cityId });

    console.log("🟣 [Controller] lojas retornadas:", stores.length);

    return reply.status(200).send(stores);
  } catch {
    return reply.status(400).send({
      message: "Erro ao listar lojas",
    });
  }
}
