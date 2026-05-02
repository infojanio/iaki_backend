import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeUpdateMyStoreCategoriesUseCase } from "@/use-cases/_factories/make-update-my-store-categories-use-case";

export async function updateMyStoreCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    categoryIds: z.array(z.string().uuid()),
  });

  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const { categoryIds } = bodySchema.parse(request.body);

  const useCase = makeUpdateMyStoreCategoriesUseCase();

  await useCase.execute({
    storeId,
    categoryIds,
  });

  return reply.status(204).send();
}
