import { makeListMyStoreCategoriesUseCase } from "@/use-cases/_factories/make-list--my-store-categories-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function listMyStoreCategoriesController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListMyStoreCategoriesUseCase();

  const { categories } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: categories,
  });
}
