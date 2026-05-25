import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeAttachUserStoreUseCase } from "@/use-cases/_factories/make-attach-user-store-use-case";

export async function attachUserStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    userId: z.string().uuid(),
  });

  const bodySchema = z.object({
    storeId: z.string().uuid(),
  });

  try {
    const { userId } = paramsSchema.parse(request.params);

    const { storeId } = bodySchema.parse(request.body);

    const useCase = makeAttachUserStoreUseCase();

    await useCase.execute({
      userId,
      storeId,
    });

    return reply.status(200).send({
      message: "Usuário vinculado à loja com sucesso.",
    });
  } catch (error) {
    console.error("[ATTACH USER STORE ERROR]", error);

    return reply.status(500).send({
      message: "Erro ao vincular usuário à loja.",
    });
  }
}
