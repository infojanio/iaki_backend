import { makeDeleteStoreDiscountUseCase } from "@/use-cases/_factories/make-delete-store-discount-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function deleteStoreDiscountController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  try {
    const { id } = paramsSchema.parse(request.params);

    const useCase = makeDeleteStoreDiscountUseCase();
    await useCase.execute(id);

    return reply.status(204).send();
  } catch (error: any) {
    return reply.status(400).send({
      message: error.message ?? "Erro ao remover desconto",
    });
  }
}
