import { FastifyReply, FastifyRequest } from "fastify";
import { makeValidateStoreLimitsUseCase } from "@/use-cases/_factories/make-validate-store-limits-use-case";
import { StoreLimitExceededError } from "@/utils/messages/errors/store-limit-exceeded-error";

type LimitedResource = "products" | "banners" | "reels" | "categories";

export function checkStoreLimit(resource: LimitedResource) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const storeId =
      request.user.role === "SUPER_ADMIN"
        ? (request.body as any)?.storeId || (request.params as any)?.storeId
        : request.user.storeId;

    if (!storeId) {
      return reply.status(400).send({
        message: "Loja não identificada.",
      });
    }

    try {
      const useCase = makeValidateStoreLimitsUseCase();

      /**
       * 🔥 AGORA RETORNAMOS MAIS DADOS
       */
      const result = await useCase.execute({
        storeId,
        resource,
      });

      /**
       * result esperado:
       * {
       *   usage: number
       *   limit: number
       * }
       */

      const { current, limit } = result;

      /**
       * 🚨 CASO ESTEJA ACIMA DO LIMITE (downgrade)
       */
      if (current > limit) {
        return reply.status(403).send({
          message:
            "Você excedeu o limite do seu plano. Desative itens ou faça upgrade para continuar.",
          code: "PLAN_LIMIT_EXCEEDED",
          resource,
          current,
          limit,
          overLimit: true,
        });
      }

      /**
       * 🚨 CASO ATINJA O LIMITE (bloqueia criação)
       */
      if (current >= limit) {
        return reply.status(403).send({
          message: "Limite do plano atingido.",
          code: "PLAN_LIMIT_EXCEEDED",
          resource,
          current,
          limit,
          overLimit: false,
        });
      }

      /**
       * ⚠️ ALERTA (80% do limite)
       */
      const percentage = (current / limit) * 100;

      if (percentage >= 80) {
        /**
         * não bloqueia, só adiciona aviso
         * pode ser usado no frontend via header
         */
        reply.header(
          "x-plan-warning",
          JSON.stringify({
            resource,
            current,
            limit,
            message: `Você já utilizou ${current}/${limit} (${Math.round(
              percentage,
            )}%) do limite de ${resource}.`,
          }),
        );
      }

      /**
       * segue fluxo normal
       */
    } catch (error: any) {
      if (error instanceof StoreLimitExceededError) {
        return reply.status(403).send({
          message: error.message,
          code: "PLAN_LIMIT_EXCEEDED",
          resource,
        });
      }

      console.error("CHECK STORE LIMIT ERROR:", error);

      return reply.status(400).send({
        message: error.message || "Erro ao validar limite do plano.",
      });
    }
  };
}
