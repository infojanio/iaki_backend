import { prisma } from "@/lib/prisma";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

import { AttachUserStoreUseCase } from "../users/attach-user-store";

export function makeAttachUserStoreUseCase() {
  const usersRepository = new PrismaUsersRepository(prisma);

  return new AttachUserStoreUseCase(usersRepository);
}
