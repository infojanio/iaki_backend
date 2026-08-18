import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { NodemailerMailProvider } from "@/providers/mail/nodemailer-mail-provider";

import { DeleteUserUseCase } from "../users/delete-user";
import { prisma } from "@/lib/prisma";

export function makeDeleteUserUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  const mailProvider = new NodemailerMailProvider();

  const deleteUserUseCase = new DeleteUserUseCase(
    usersRepository,
    mailProvider,
  );

  return deleteUserUseCase;
}
