import { State } from "@prisma/client";
import { StatesRepository } from "@/repositories/prisma/Iprisma/states-repository";

interface UpdateStateUseCaseRequest {
  id: string;
  name?: string;
  uf?: string;
}

interface UpdateStateUseCaseResponse {
  state: State;
}

export class UpdateStateUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute({
    id,
    name,
    uf,
  }: UpdateStateUseCaseRequest): Promise<UpdateStateUseCaseResponse> {
    const stateExists = await this.statesRepository.findById(id);

    if (!stateExists) {
      throw new Error("Estado não encontrado.");
    }

    const state = await this.statesRepository.update(id, {
      name,
      uf: uf?.toUpperCase(),
    });

    return { state };
  }
}
