import { makeDeleteStoreBusinessCategoryUseCase } from "@/use-cases/_factories/make-delete-store-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function deleteStoreBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeleteStoreBusinessCategoryUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({
      message: "Relação loja-categoria não encontrada",
    });
  }
}
