import { randomInt, randomUUID } from "node:crypto";

import { MailProvider } from "@/providers/mail/mail-provider";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface Request {
  email: string;
}

export class ForgotPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,

    private mailProvider: MailProvider,

    private tokenProvider: PasswordResetTokenProvider,
  ) {}

  async execute({ email }: Request) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersRepository.findByEmail(normalizedEmail);

    /*
     * Código sempre no formato
     * 000000 até 999999.
     */
    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");

    /*
     * Não revelar para o frontend
     * se o usuário existe.
     */
    if (!user) {
      /*
       * Challenge falso para manter
       * o mesmo formato de resposta.
       */

      const fakeChallenge = this.tokenProvider.generate({
        userId: randomUUID(),

        email: normalizedEmail,

        code,

        passwordHash: randomUUID(),
      });

      return {
        challenge: fakeChallenge,
      };
    }

    const challenge = this.tokenProvider.generate({
      userId: user.id,

      email: user.email,

      code,

      passwordHash: user.passwordHash,
    });

    await this.mailProvider.sendMail({
      to: user.email,

      subject: "Código de recuperação - Clube IAki",

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            max-width:520px;
            margin:auto;
          "
        >
          <h2
            style="color:#6d28d9;"
          >
            Clube IAki
          </h2>

          <p>
            Olá, ${user.name}.
          </p>

          <p>
            Use o código abaixo para
            redefinir sua senha:
          </p>

          <div
            style="
              background:#f5f3ff;
              padding:18px;
              border-radius:12px;
              text-align:center;
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#5b21b6;
            "
          >
            ${code}
          </div>

          <p>
            O código é válido por
            10 minutos.
          </p>

          <p>
            Caso não tenha solicitado
            esta alteração, ignore
            este e-mail.
          </p>
        </div>
      `,
    });

    return {
      challenge,
    };
  }
}
