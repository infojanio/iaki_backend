import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserOrdersHistoryUseCase } from "@/use-cases/_factories/make-fetch-user-orders-history-use-case";
import { OrderStatus } from "@prisma/client";

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const { page, status } = z
    .object({
      page: z.coerce.number().min(1).default(1),
      status: z.nativeEnum(OrderStatus).optional(),
    })
    .parse(request.query);

  const userId = request.user.sub as string;

  const useCase = makeFetchUserOrdersHistoryUseCase();

  const result = await useCase.execute({
    userId,
    page,
    status,
  });

  return reply.status(200).send(result);
}
