import { PrismaPlansRepository } from "@/repositories/prisma/prisma-plans-repository";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function getPlanById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = paramsSchema.parse(request.params);

  const plansRepository = new PrismaPlansRepository();
  const plan = await plansRepository.findById(id);

  if (!plan) {
    return reply.status(404).send({
      message: "Plano não encontrado.",
    });
  }

  return reply.status(200).send({ plan });
}
