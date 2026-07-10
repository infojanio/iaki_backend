import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateReelUseCase } from "@/use-cases/_factories/make-create-reel-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createReelBodySchema = z.object({
    title: z.string().min(1, "Título é obrigatório."),
    imageUrl: z.string().min(1, "Imagem é obrigatória."),
    link: z.string().optional().default(""),

    // SUPER_ADMIN pode informar a loja manualmente
    storeId: z.string().uuid("Loja inválida.").optional(),
  });

  try {
    const {
      title,
      imageUrl,
      link,
      storeId: bodyStoreId,
    } = createReelBodySchema.parse(request.body);

    console.log("[CREATE REEL USER]", request.user);
    console.log("[CREATE REEL BODY STORE ID]", bodyStoreId);

    let storeId: string | undefined;

    /**
     * ===================================
     * SUPER_ADMIN
     * ===================================
     */
    if (request.user?.role === "SUPER_ADMIN") {
      /**
       * Prioridade:
       * 1. storeId enviado no body
       * 2. storeId vinculado ao SUPER_ADMIN no token
       */
      storeId = bodyStoreId ?? request.user.storeId;

      if (!storeId) {
        return reply.status(400).send({
          message: "Informe uma loja para cadastrar o reel.",
        });
      }
    }

    /**
     * ===================================
     * ADMIN
     * ===================================
     */
    if (request.user?.role === "ADMIN") {
      storeId = request.user.storeId;

      if (!storeId) {
        return reply.status(403).send({
          message: "Usuário não vinculado a uma loja.",
        });
      }
    }

    if (!storeId) {
      return reply.status(403).send({
        message: "Perfil de usuário não autorizado para cadastrar reel.",
      });
    }

    const createReelUseCase = makeCreateReelUseCase();

    await createReelUseCase.execute({
      title,
      imageUrl,
      link,
      storeId,
      createdAt: new Date(),
    });

    return reply.status(201).send({
      message: "Reel criado com sucesso.",
    });
  } catch (error) {
    console.error("[CREATE REEL ERROR]", error);

    return reply.status(400).send({
      message: error instanceof Error ? error.message : "Erro ao criar reel.",
    });
  }
}
