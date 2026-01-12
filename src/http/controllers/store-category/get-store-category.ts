import { makeGetStoreCategoryUseCase } from "@/use-cases/_factories/make-get-store-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getStoreCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeGetStoreCategoryUseCase();
    const { relation } = await useCase.execute({ id });

    return reply.status(200).send(relation);
  } catch (error) {
    return reply.status(404).send({
      message: "Relação loja-categoria não encontrada",
    });
  }
}
