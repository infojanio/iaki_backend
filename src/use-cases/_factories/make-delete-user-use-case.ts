import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { DeleteUserUseCase } from "../users/delete-user";

import { prisma } from "@/lib/prisma";
export function makeDeleteUserUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  const useCase = new DeleteUserUseCase(usersRepository);
  return useCase;
}
