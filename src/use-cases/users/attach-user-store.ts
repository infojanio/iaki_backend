import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";

interface Request {
  userId: string;
  storeId: string;
}

export class AttachUserStoreUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, storeId }: Request) {
    await this.usersRepository.attachStore(userId, storeId);
  }
}
