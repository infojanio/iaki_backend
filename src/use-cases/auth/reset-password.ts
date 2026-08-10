import { hash } from "bcryptjs";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface Request {
  challenge: string;
  code: string;
  password: string;
}

export class InvalidPasswordResetError extends Error {
  constructor() {
    super("Código inválido ou expirado.");
  }
}

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,

    private tokenProvider: PasswordResetTokenProvider,
  ) {}

  async execute({ challenge, code, password }: Request) {
    let payload;

    try {
      payload = this.tokenProvider.verify(challenge);
    } catch {
      throw new InvalidPasswordResetError();
    }

    const codeIsValid = this.tokenProvider.validateCode({
      payload,
      code,
    });

    if (!codeIsValid) {
      throw new InvalidPasswordResetError();
    }

    const user = await this.usersRepository.findByEmail(payload.email);

    if (!user || user.id !== payload.userId) {
      throw new InvalidPasswordResetError();
    }

    /*
     * Verifica se a senha ainda é
     * aquela de quando o challenge
     * foi criado.
     *
     * Depois que a senha for
     * alterada, o token antigo
     * deixa de funcionar.
     */
    const currentFingerprint = this.tokenProvider.generatePasswordFingerprint(
      user.passwordHash,
    );

    if (currentFingerprint !== payload.passwordFingerprint) {
      throw new InvalidPasswordResetError();
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.updatePassword(user.id, passwordHash);

    return {
      message: "Senha alterada com sucesso.",
    };
  }
}
