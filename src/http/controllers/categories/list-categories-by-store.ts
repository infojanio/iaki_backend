import { FastifyReply, FastifyRequest } from "fastify";

import { makeListCategoriesByStoreUseCase } from "@/use-cases/_factories/make-list-categories-by-store-use-case";

export async function listCategoriesByStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListCategoriesByStoreUseCase();

  const { categories } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: categories,
  });
}
