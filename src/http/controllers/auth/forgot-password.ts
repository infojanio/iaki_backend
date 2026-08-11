import { makeForgotPasswordUseCase } from "@/use-cases/_factories/make-forgot-password-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

import { z } from "zod";

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.string().trim().email("Informe um e-mail válido."),
  });

  const { email } = bodySchema.parse(request.body);

  const useCase = makeForgotPasswordUseCase();

  const { challenge } = await useCase.execute({
    email,
  });

  return reply.status(200).send({
    message:
      "Caso o e-mail esteja cadastrado, um código de recuperação será enviado.",

    challenge,
  });
}
