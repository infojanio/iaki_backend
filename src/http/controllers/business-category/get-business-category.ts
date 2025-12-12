import { makeGetBusinessCategoryUseCase } from "@/use-cases/_factories/make-get-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeGetBusinessCategoryUseCase();
    const { category } = await useCase.execute({ id });

    return reply.status(200).send(category);
  } catch (error) {
    return reply.status(404).send({
      message: "Categoria não encontrada",
    });
  }
}
