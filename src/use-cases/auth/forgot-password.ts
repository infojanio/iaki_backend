import { randomInt, randomUUID } from "node:crypto";

import { MailProvider } from "@/providers/mail/mail-provider";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  challenge: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,

    private mailProvider: MailProvider,

    private passwordResetTokenProvider: PasswordResetTokenProvider,
  ) {}

  async execute({
    email,
  }: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersRepository.findByEmail(normalizedEmail);

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");

    /*
     * Caso não exista usuário,
     * retornamos um challenge falso.
     *
     * Assim a API não confirma
     * publicamente se o e-mail
     * existe no IAki.
     */
    if (!user) {
      const fakeChallenge = this.passwordResetTokenProvider.generate({
        userId: randomUUID(),

        email: normalizedEmail,

        code,

        passwordHash: randomUUID(),
      });

      return {
        challenge: fakeChallenge,
      };
    }

    const challenge = this.passwordResetTokenProvider.generate({
      userId: user.id,

      email: user.email,

      code,

      passwordHash: user.passwordHash,
    });

    await this.mailProvider.sendMail({
      to: user.email,

      subject: "Recuperação de senha - Clube IAki",

      text: `Seu código para redefinir a senha do Clube IAki é ${code}. O código é válido por 10 minutos.`,

      html: `
        <!DOCTYPE html>

        <html lang="pt-BR">
          <body
            style="
              margin: 0;
              padding: 0;
              background: #f5f3ff;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <div
              style="
                max-width: 520px;
                margin: 0 auto;
                padding: 32px 16px;
              "
            >
              <div
                style="
                  background: #ffffff;
                  border-radius: 16px;
                  padding: 32px;
                "
              >
                <div
                  style="
                    font-size: 24px;
                    font-weight: bold;
                    color: #6d28d9;
                    margin-bottom: 24px;
                  "
                >
                  Clube IAki
                </div>

                <h2
                  style="
                    margin: 0 0 16px;
                    color: #111827;
                  "
                >
                  Recuperação de senha
                </h2>

                <p
                  style="
                    color: #374151;
                    line-height: 1.6;
                  "
                >
                  Olá, ${user.name}.
                </p>

                <p
                  style="
                    color: #374151;
                    line-height: 1.6;
                  "
                >
                  Recebemos uma solicitação
                  para redefinir sua senha.
                </p>

                <p
                  style="
                    color: #374151;
                  "
                >
                  Informe este código no aplicativo:
                </p>

                <div
                  style="
                    margin: 24px 0;
                    padding: 20px;
                    text-align: center;
                    border-radius: 12px;
                    background: #f5f3ff;
                    color: #5b21b6;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 8px;
                  "
                >
                  ${code}
                </div>

                <p
                  style="
                    color: #374151;
                    line-height: 1.6;
                  "
                >
                  Este código é válido por
                  <strong>10 minutos</strong>.
                </p>

                <p
                  style="
                    margin-top: 24px;
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.5;
                  "
                >
                  Caso você não tenha solicitado
                  uma nova senha, ignore este e-mail.
                </p>
              </div>

              <p
                style="
                  text-align: center;
                  color: #9ca3af;
                  font-size: 12px;
                  margin-top: 20px;
                "
              >
                Clube IAki
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return {
      challenge,
    };
  }
}
