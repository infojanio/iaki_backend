import { makeGetStorePointsUseCase } from "@/use-cases/_factories/make-get-store-points-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function getStorePoints(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const { storeId } = paramsSchema.parse(request.params);

  const userId = request.user.sub;

  const getStorePointsUseCase = makeGetStorePointsUseCase();

  try {
    const result = await getStorePointsUseCase.execute({
      userId,
      storeId,
    });

    return reply.status(200).send(result);
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message,
    });
  }
}
