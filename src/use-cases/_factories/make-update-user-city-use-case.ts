import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaCartsRepository } from "@/repositories/prisma/prisma-carts-repository";
import { prisma } from "@/lib/prisma";
import { UpdateUserCityUseCase } from "../users/update-user-city";

export function makeUpdateUserCityUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const cartsRepository = new PrismaCartsRepository(prisma);

  return new UpdateUserCityUseCase(usersRepository, cartsRepository);
}
