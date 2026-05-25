import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface ListUsersUseCaseRequest {
  page: number;
  query?: string;
}

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ page, query }: ListUsersUseCaseRequest) {
    const result = await this.usersRepository.findManyUsers({
      page,
      query,
    });

    return result;
  }
}
