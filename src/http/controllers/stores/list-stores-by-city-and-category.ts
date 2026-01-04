import { makeListStoresByCityAndCategoryUseCase } from "@/use-cases/_factories/make-list-stores-by-city-and-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listStoresByCityAndCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    cityId: z.string().uuid(),
    categoryId: z.string().uuid(),
  });

  try {
    console.log("🟣 [Controller] params recebidos:", request.params);
    const { cityId, categoryId } = paramsSchema.parse(request.params);

    const useCase = makeListStoresByCityAndCategoryUseCase();
    const { stores } = await useCase.execute({ cityId, categoryId });

    console.log("🟣 [Controller] lojas retornadas:", stores.length);

    return reply.status(200).send(stores);
  } catch {
    return reply.status(400).send({
      message: "Erro ao listar lojas",
    });
  }
}
