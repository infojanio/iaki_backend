import { FastifyReply, FastifyRequest } from "fastify";

import { makeListSubcategoriesByStoreUseCase } from "@/use-cases/_factories/make-list-subcategories-by-store-use-case";

export async function listSubcategoriesByStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const useCase = makeListSubcategoriesByStoreUseCase();

  const { subcategories } = await useCase.execute({
    storeId,
  });

  return reply.status(200).send({
    data: subcategories,
  });
}
