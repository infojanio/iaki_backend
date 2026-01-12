import { makeListStoresByCategoriesUseCase } from "@/use-cases/_factories/make-list-stores-by-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listStoreByCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = paramsSchema.parse(request.params);

  console.log("🔵 [Controller] Id recebido:", categoryId);

  const useCase = makeListStoresByCategoriesUseCase();
  const { stores } = await useCase.execute({ categoryId });

  console.log("🔵 [Controller] Total de lojas:", stores.length);

  return reply.status(200).send(stores);
}
