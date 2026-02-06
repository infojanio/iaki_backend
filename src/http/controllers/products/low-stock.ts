import { FastifyReply, FastifyRequest } from "fastify";

import { makeGetLowStockProductsUseCase } from "@/use-cases/_factories/make-get-low-stock-products-use-case";

export async function lowStock(request: FastifyRequest, reply: FastifyReply) {
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({ message: "Sem loja vinculada" });
  }

  const useCase = makeGetLowStockProductsUseCase();
  const result = await useCase.execute({ storeId });

  return reply.send(result);
}
