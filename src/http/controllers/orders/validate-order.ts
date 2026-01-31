import { makeValidateOrderUseCase } from "@/use-cases/_factories/make-validate-order-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function validateOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  });

  const { orderId } = paramsSchema.parse(request.params);

  // 🔐 storeId vem do JWT (STORE_ADMIN)
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  const validateOrderUseCase = makeValidateOrderUseCase();

  try {
    const result = await validateOrderUseCase.execute({
      orderId,
      storeId,
    });

    return reply.status(200).send({
      message: "Pedido validado com sucesso.",
      orderId: result.orderId,
      status: result.status,
      cashbackCredited: result.cashbackCredited,
    });
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message ?? "Erro ao validar pedido.",
    });
  }
}
