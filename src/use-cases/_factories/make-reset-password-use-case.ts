import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { PasswordResetTokenProvider } from "@/providers/password-reset/password-reset-token-provider";
import { ResetPasswordUseCase } from "../auth/reset-password";
import { prisma } from "@/lib/prisma";

export function makeResetPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  const tokenProvider = new PasswordResetTokenProvider();

  return new ResetPasswordUseCase(usersRepository, tokenProvider);
}
