import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { ForgotPasswordUseCase } from "../auth/forgot-password";
import { prisma } from "@/lib/prisma";

export function makeForgotPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  const mailProvider = new NodemailerMailProvider();

  const tokenProvider = new PasswordResetTokenProvider();

  return new ForgotPasswordUseCase(
    usersRepository,
    mailProvider,
    tokenProvider,
  );
}
