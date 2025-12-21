import { State } from "@prisma/client";
import { StatesRepository } from "@/repositories/prisma/Iprisma/states-repository";

interface GetStateUseCaseRequest {
  id: string;
}

interface GetStateUseCaseResponse {
  state: State;
}

export class GetStateUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute({
    id,
  }: GetStateUseCaseRequest): Promise<GetStateUseCaseResponse> {
    const state = await this.statesRepository.findById(id);

    if (!state) {
      throw new Error("Estado não encontrado.");
    }

    return { state };
  }
}
