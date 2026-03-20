import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateStoreLimitsUseCase } from "@/use-cases/_factories/make-validate-store-limits-use-case";
import { StoreLimitExceededError } from "@/utils/messages/errors/store-limit-exceeded-error";

export async function validateStoreLimits(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    resource: z.enum(["products", "banners", "reels", "categories"]),
  });

  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Usuário não vinculado a uma loja.",
    });
  }

  try {
    const { resource } = paramsSchema.parse(request.params);

    const useCase = makeValidateStoreLimitsUseCase();
    const result = await useCase.execute({ storeId, resource });

    return reply.status(200).send(result);
  } catch (error: any) {
    if (error instanceof StoreLimitExceededError) {
      return reply.status(403).send({ message: error.message });
    }

    throw error;
  }
}
