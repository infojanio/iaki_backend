import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeUpdateStoreUseCase } from "@/use-cases/_factories/make-update-store-use-case";

export async function updateStore(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    storeId: z.string().uuid("ID inválido"),
  });

  const bodySchema = z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    isActive: z.boolean().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    phone: z.string().optional(),
    cnpj: z.string().optional(),
    avatar: z.string().optional(),
    street: z.string().optional(),
    postalCode: z.string().optional(),
    cityId: z.string().optional(),
  });

  try {
    const { storeId } = paramsSchema.parse(request.params);
    const data = bodySchema.parse(request.body);

    const updateStoreUseCase = makeUpdateStoreUseCase();

    const { store } = await updateStoreUseCase.execute({
      storeId,
      ...data,
    });

    return reply.status(200).send(store);
  } catch (err: any) {
    return reply.status(400).send({
      message: err.message ?? "Erro ao atualizar loja.",
    });
  }
}
