// src/http/controllers/users/request-account-deletion.ts

import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { makeRequestAccountDeletionUseCase } from "@/use-cases/_factories/make-request-account-deletion-use-case";

export async function RequestAccountDeletion(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().trim().min(3, "Informe seu nome."),

    email: z.string().trim().email("Informe um e-mail válido."),

    reason: z.string().trim().max(500).optional(),
  });

  try {
    const { name, email, reason } = bodySchema.parse(request.body);

    const useCase = makeRequestAccountDeletionUseCase();

    await useCase.execute({
      name,
      email,
      reason,
    });

    return reply.status(200).send({
      message: "Solicitação de exclusão enviada com sucesso.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos.",
        errors: error.flatten().fieldErrors,
      });
    }

    console.error("[RequestAccountDeletion]", error);

    return reply.status(500).send({
      message: "Não foi possível enviar sua solicitação.",
    });
  }
}
