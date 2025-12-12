import { makeUpdateBusinessCategoryUseCase } from "@/use-cases/_factories/make-update-business-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function updateBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const bodySchema = z.object({
    name: z.string().min(2).optional(),
    image: z.string().nullable().optional(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const useCase = makeUpdateBusinessCategoryUseCase();
    const { category } = await useCase.execute({ id, ...data });

    return reply.status(200).send(category);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao atualizar categoria",
    });
  }
}
