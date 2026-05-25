import { prisma } from "@/lib/prisma";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { ListUsersUseCase } from "../users/list-users";

export function makeListUsersUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  return new ListUsersUseCase(usersRepository);
}
