import { FastifyReply, FastifyRequest } from "fastify";
import { makeListPlansUseCase } from "@/use-cases/_factories/make-list-plans-use-case";

export async function listPlans(request: FastifyRequest, reply: FastifyReply) {
  const useCase = makeListPlansUseCase();
  const { plans } = await useCase.execute();

  if (request.user.role === "SUPER_ADMIN") {
    return reply.status(200).send({ plans });
  }

  return reply.status(200).send({
    plans: plans.filter((plan) => plan.isActive),
  });
}
