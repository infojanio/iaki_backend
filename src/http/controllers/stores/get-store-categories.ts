import { makeGetStoreCategoriesUseCase } from "@/use-cases/_factories/make-get-store-categories-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getStoreCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const getStoreCategoriesUseCase = makeGetStoreCategoriesUseCase();

  const categories = await getStoreCategoriesUseCase.execute({
    storeId,
  });

  return reply.status(200).send(categories);
}
