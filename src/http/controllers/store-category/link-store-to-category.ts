import { z } from "zod";
import { makeLinkStoreCategoryUseCase } from "@/use-cases/_factories/make-link-store-to-category-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { StoreCategoryAlreadyLinkedError } from "@/utils/messages/errors/store-category-already-linked-error";
import { ResourceNotFoundError } from "@/utils/messages/errors/resource-not-found-error";

export async function LinkStoreToCategoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    storeId: z.string().uuid(),
    categoryId: z.string().uuid(),
  });

  const { storeId, categoryId } = bodySchema.parse(request.body);

  try {
    const useCase = makeLinkStoreCategoryUseCase();

    await useCase.execute({
      storeId,
      categoryId,
    });

    return reply.status(201).send({
      message: "Categoria vinculada à loja com sucesso",
    });
  } catch (error) {
    // 🔁 vínculo já existe
    if (error instanceof StoreCategoryAlreadyLinkedError) {
      return reply.status(409).send({
        message: "Esta categoria já está vinculada a esta loja",
      });
    }

    // 🔎 loja ou categoria não encontrada
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    // ❌ erro inesperado
    request.log.error(error);

    return reply.status(500).send({
      message: "Erro ao vincular categoria à loja",
    });
  }
}
