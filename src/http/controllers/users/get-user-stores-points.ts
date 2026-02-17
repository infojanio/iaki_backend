import { makeGetUserStoresPointsUseCase } from "@/use-cases/_factories/make-get-user-stores-points-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getUserStoresPoints(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string().uuid(),
  });

  const userId = request.user.sub;

  const getUserPointsUseCase = makeGetUserStoresPointsUseCase();

  try {
    const result = await getUserPointsUseCase.execute({
      userId,
    });

    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message,
    });
  }
}
