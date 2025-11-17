// src/http/controllers/stores/toggleStatus.ts

import { makeToggleStoreStatusUseCase } from "@/use-cases/_factories/make-toggle-store-status-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function toggleStatus(req: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    storeId: z.string().uuid(),
  });

  const bodySchema = z.object({
    isActive: z.boolean(),
  });

  const { storeId } = paramsSchema.parse(req.params);
  const { isActive } = bodySchema.parse(req.body);

  const toggleStoreStatusUseCase = makeToggleStoreStatusUseCase();

  const result = await toggleStoreStatusUseCase.execute({
    storeId,
    isActive,
  });

  return reply.status(200).send(result);
}
