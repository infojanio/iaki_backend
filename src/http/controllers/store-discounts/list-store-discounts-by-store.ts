import { makeListStoreDiscountsByStoreUseCase } from "@/use-cases/_factories/make-list-store-discounts-by-store-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function listStoreDiscountsByStoreController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  try {
    const { storeId } = paramsSchema.parse(request.params);

    const useCase = makeListStoreDiscountsByStoreUseCase();
    const discounts = await useCase.execute(storeId);

    return reply.status(200).send(discounts);
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao listar descontos da loja",
    });
  }
}
