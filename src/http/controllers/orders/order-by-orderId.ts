import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchOrderByIdUseCase } from "@/use-cases/_factories/make-fetch-order-by-id-use-case";

export async function getOrderByOrderId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    orderId: z.string().uuid(),
  });

  const { orderId } = paramsSchema.parse(request.params);

  const useCase = makeFetchOrderByIdUseCase();
  const order = await useCase.execute({ orderId });

  return reply.status(200).send(order);
}
