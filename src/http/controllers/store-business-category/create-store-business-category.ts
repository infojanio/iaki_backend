import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateStoreBusinessCategoryUseCase } from "@/use-cases/_factories/make-create-store-business-category-use-case";

export async function createStoreBusinessCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    categoryId: z.string().uuid(),
  });

  try {
    const data = bodySchema.parse(request.body);

    const useCase = makeCreateStoreBusinessCategoryUseCase();
    const { relation } = await useCase.execute(data);

    return reply.status(201).send(relation);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro de validação",
        errors: error.flatten().fieldErrors,
      });
    }

    return reply.status(400).send({
      message: error.message ?? "Erro ao vincular loja à categoria",
    });
  }
}
