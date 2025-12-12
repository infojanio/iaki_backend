import { makeDeleteBusinessCategoryUseCase } from "@/use-cases/_factories/make-delete-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function deleteBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeleteBusinessCategoryUseCase();
    await useCase.execute({ id });

    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({
      message: "Categoria não encontrada",
    });
  }
}
