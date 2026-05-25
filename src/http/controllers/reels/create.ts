import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { makeCreateReelUseCase } from "@/use-cases/_factories/make-create-reel-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createReelBodySchema = z.object({
    title: z.string(),

    imageUrl: z.string(),

    link: z.string(),

    // 🔥 SUPER_ADMIN pode informar loja
    storeId: z.string().uuid().optional(),
  });

  try {
    const {
      title,
      imageUrl,
      link,
      storeId: bodyStoreId,
    } = createReelBodySchema.parse(request.body);

    console.log("[CREATE REEL USER]", request.user);

    let storeId: string | undefined;

    /**
     * ===================================
     * 👑 SUPER_ADMIN
     * ===================================
     */
    if (request.user?.role === "SUPER_ADMIN") {
      // 🔥 usa storeId enviado no body
      storeId = bodyStoreId;

      // 🔥 SUPER_ADMIN pode criar reel sem loja
      // (global / institucional)
    } else {
      /**
       * ===================================
       * 🏪 ADMIN
       * ===================================
       */
      storeId = request.user?.storeId;

      if (!storeId) {
        return reply.status(403).send({
          message: "Usuário não vinculado a uma loja.",
        });
      }
    }

    const createReelUseCase = makeCreateReelUseCase();

    await createReelUseCase.execute({
      title,
      imageUrl,
      link,

      // 🔥 null se SUPER_ADMIN não enviar
      storeId: storeId ?? "7acc5660-c054-4f67-af7b-068e902d3bd4",

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
