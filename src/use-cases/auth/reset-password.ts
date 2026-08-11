import { hash } from "bcryptjs";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface ResetPasswordRequest {
  challenge: string;

  code: string;

  newPassword: string;
}

export class InvalidPasswordResetCodeError extends Error {
  constructor() {
    super("Código inválido ou expirado.");
  }
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,

    private passwordResetTokenProvider: PasswordResetTokenProvider,
  ) {}

  async execute({ challenge, code, newPassword }: ResetPasswordRequest) {
    let payload;

    try {
      payload = this.passwordResetTokenProvider.verify(challenge);
    } catch {
      throw new InvalidPasswordResetCodeError();
    }

    const validCode = this.passwordResetTokenProvider.validateCode(
      payload,
      code,
    );

    if (!validCode) {
      throw new InvalidPasswordResetCodeError();
    }

    const user = await this.usersRepository.findByEmail(payload.email);

    if (!user || user.id !== payload.userId) {
      throw new InvalidPasswordResetCodeError();
    }

    /*
     * Confere se a senha atual continua
     * sendo a mesma de quando o código
     * foi solicitado.
     */
    const passwordStillValid =
      this.passwordResetTokenProvider.validatePasswordFingerprint(
        payload,
        user.passwordHash,
      );

    if (!passwordStillValid) {
      throw new InvalidPasswordResetCodeError();
    }

    /*
     * IMPORTANTE:
     * utilize aqui o mesmo número de
     * rounds usado no cadastro.
     */
    const passwordHash = await hash(newPassword, 6);

    await this.usersRepository.updatePassword(user.id, passwordHash);

    return {
      message: "Senha alterada com sucesso.",
    };
  }
}
