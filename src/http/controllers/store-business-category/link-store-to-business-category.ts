import { z } from "zod";
import { makeLinkStoreToBusinessCategoryUseCase } from "@/use-cases/_factories/make-link-store-to-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export async function LinkStoreToBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    categoryId: z.string().uuid(),
    storeId: z.string().uuid(),
  });

  const { categoryId, storeId } = bodySchema.parse(request.body);

  const useCase = makeLinkStoreToBusinessCategoryUseCase();
  await useCase.execute({ categoryId, storeId });

  return reply.status(201).send();
}
