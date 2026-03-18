import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeListStoreBusinessCategoryLinksUseCase } from "@/use-cases/_factories/make-list-store-business-category-links-use-case";

export async function getStoreBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    categoryId: z.string().uuid(),
  });

  const { categoryId } = paramsSchema.parse(request.params);

  const useCase = makeListStoreBusinessCategoryLinksUseCase();
  const { links } = await useCase.execute({ categoryId });

  return reply.status(200).send(links);
}
