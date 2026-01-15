import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateOrderUseCase } from "@/use-cases/_factories/make-create-order-use-case";

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub;
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(400).send({
      message: "Loja não informada.",
    });
  }

  const createOrderUseCase = makeCreateOrderUseCase();

  const order = await createOrderUseCase.execute({
    userId,
    storeId,
  });

  return reply.status(201).send(order);
}
