import { FastifyReply, FastifyRequest } from "fastify";
import { makeListSubscriptionsUseCase } from "@/use-cases/_factories/make-list-subscriptions-use-case";

export async function listSubscriptions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeListSubscriptionsUseCase();

  const result = await useCase.execute();

  return reply.status(200).send(result);
}
