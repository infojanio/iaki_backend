import { StatesRepository } from "@/repositories/prisma/Iprisma/states-repository";

interface DeleteStateUseCaseRequest {
  id: string;
}

export class DeleteStateUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute({ id }: DeleteStateUseCaseRequest) {
    const stateExists = await this.statesRepository.findById(id);

    if (!stateExists) {
      throw new Error("Estado não encontrado.");
    }

    await this.statesRepository.delete(id);
  }
}
