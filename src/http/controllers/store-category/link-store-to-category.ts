import { z } from "zod";
import { makeLinkStoreCategoryUseCase } from "@/use-cases/_factories/make-link-store-to-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function LinkStoreToCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    categoryId: z.string().uuid(),
  });

  const { storeId, categoryId } = bodySchema.parse(request.body);

  const useCase = makeLinkStoreCategoryUseCase();
  await useCase.execute({ categoryId, storeId });

  return reply.status(201).send();
}
