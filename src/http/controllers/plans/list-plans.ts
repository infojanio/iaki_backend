import { FastifyReply, FastifyRequest } from "fastify";
import { makeListPlansUseCase } from "@/use-cases/_factories/make-list-plans-use-case";

export async function listPlans(_request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListPlansUseCase();
  const { plans } = await useCase.execute();

  return reply.status(200).send({ plans });
}
