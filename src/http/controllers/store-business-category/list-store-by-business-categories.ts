import { makeListStoresByBusinessCategoriesUseCase } from "@/use-cases/_factories/make-list-stores-by-business-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listStoreByBusinessCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = paramsSchema.parse(request.params);

  console.log("🔵 [Controller] businessId recebido:", categoryId);

  const useCase = makeListStoresByBusinessCategoriesUseCase();
  const { stores } = await useCase.execute({ categoryId });

  console.log("🔵 [Controller] Total de lojas:", stores.length);

  return reply.status(200).send(stores);
}
