import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

import { InvalidPasswordResetCodeError } from "@/use-cases/auth/reset-password";
import { makeResetPasswordUseCase } from "@/use-cases/_factories/make-reset-password-use-case";

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    challenge: z.string().min(1),

    code: z.string().regex(/^\d{6}$/, "O código deve possuir 6 dígitos."),

    newPassword: z
      .string()
      .min(6, "A nova senha deve possuir pelo menos 6 caracteres."),
  });

  const data = bodySchema.parse(request.body);

  try {
    const useCase = makeResetPasswordUseCase();

    const result = await useCase.execute(data);

    return reply.status(200).send(result);
  } catch (error) {
    if (error instanceof InvalidPasswordResetCodeError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }
}
