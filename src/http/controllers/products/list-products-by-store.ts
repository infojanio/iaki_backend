import { makeListProductsByStoreUseCase } from "@/use-cases/_factories/make-list-products-by-store-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listProductsByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  try {
    const { storeId } = paramsSchema.parse(request.params);

    const useCase = makeListProductsByStoreUseCase();
    const { products } = await useCase.execute({ storeId });

    return reply.status(200).send(products);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao listar produtos da loja",
    });
  }
}
