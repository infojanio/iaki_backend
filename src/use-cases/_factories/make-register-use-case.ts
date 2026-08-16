import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseCase } from "../users/register";
import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";
import { prisma } from "@/lib/prisma";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  const mailProvider = new NodemailerMailProvider();

  const registerUseCase = new RegisterUseCase(usersRepository, mailProvider);

  return registerUseCase;
}
