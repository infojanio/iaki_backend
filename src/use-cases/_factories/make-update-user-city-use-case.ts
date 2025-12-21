import { PrismaCitiesRepository } from "@/repositories/prisma/prisma-cities-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdateUserCityUseCase } from "../update-user-city";

export function makeUpdateUserCityUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const citiesRepository = new PrismaCitiesRepository();

  return new UpdateUserCityUseCase(usersRepository, citiesRepository);
}
