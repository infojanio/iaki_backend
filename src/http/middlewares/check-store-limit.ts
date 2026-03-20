import { FastifyReply, FastifyRequest } from "fastify";
import { makeValidateStoreLimitsUseCase } from "@/use-cases/_factories/make-validate-store-limits-use-case";
import { StoreLimitExceededError } from "@/utils/messages/errors/store-limit-exceeded-error";

type LimitedResource = "products" | "banners" | "reels" | "categories";

export function checkStoreLimit(resource: LimitedResource) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const storeId =
      request.user?.storeId ||
      (request.body as { storeId?: string } | undefined)?.storeId ||
      (request.params as { storeId?: string } | undefined)?.storeId;

    if (!storeId) {
      return reply.status(403).send({
        message: "Não foi possível identificar a loja para validação do plano.",
      });
    }

    try {
      const useCase = makeValidateStoreLimitsUseCase();

      await useCase.execute({
        storeId,
        resource,
      });
    } catch (error: any) {
      if (error instanceof StoreLimitExceededError) {
        return reply.status(403).send({
          message: error.message,
          code: "PLAN_LIMIT_EXCEEDED",
          resource,
        });
      }

      throw error;
    }
  };
}
