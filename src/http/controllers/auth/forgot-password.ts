import { makeForgotPasswordUseCase } from "@/use-cases/_factories/make-forgot-password-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log("🟡 [ForgotPassword] Requisição recebida");

  try {
    const bodySchema = z.object({
      email: z.string().email(),
    });

    console.log("🟡 [ForgotPassword] Validando body");

    const { email } = bodySchema.parse(request.body);

    console.log("🟡 [ForgotPassword] Email:", email);

    console.log("🟡 [ForgotPassword] Criando use case");

    const forgotPasswordUseCase = makeForgotPasswordUseCase();

    console.log("🟡 [ForgotPassword] Executando use case");

    const result = await forgotPasswordUseCase.execute({
      email,
    });

    console.log("🟢 [ForgotPassword] Use case concluído");

    return reply.status(200).send({
      message:
        "Caso o e-mail esteja cadastrado, um código de recuperação será enviado.",
      challenge: result.challenge,
    });
  } catch (error) {
    console.error("🔴 [ForgotPassword] ERRO COMPLETO:", error);

    throw error;
  }
}
