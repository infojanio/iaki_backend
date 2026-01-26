import { makeCreateStoreEvaluationUseCase } from "@/use-cases/_factories/make-create-store-evaluation-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function createStoreEvaluationController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const bodySchema = z.object({
    rating: z.number().min(1).max(5),
  });

  const { storeId } = paramsSchema.parse(request.params);
  const { rating } = bodySchema.parse(request.body);

  const userId = request.user.sub;

  try {
    const createStoreEvaluationUseCase = makeCreateStoreEvaluationUseCase();

    const { evaluation } = await createStoreEvaluationUseCase.execute({
      userId,
      storeId,
      rating,
    });

    return reply.status(201).send({
      evaluation,
    });
  } catch (error: any) {
    if (error instanceof Error) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
