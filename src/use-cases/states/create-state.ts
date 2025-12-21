import { State } from "@prisma/client";
import { StatesRepository } from "@/repositories/prisma/Iprisma/states-repository";

interface CreateStateUseCaseRequest {
  id?: string;
  name: string;
  uf: string;
}

interface CreateStateUseCaseResponse {
  state: State;
}

export class CreateStateUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute({
    id,
    name,
    uf,
  }: CreateStateUseCaseRequest): Promise<CreateStateUseCaseResponse> {
    const ufExists = await this.statesRepository.findByUf(uf);

    if (ufExists) {
      throw new Error("Já existe um estado com esse UF.");
    }

    const state = await this.statesRepository.create({
      id,
      name,
      uf: uf.toUpperCase(),
      createdAt: new Date(),
    });

    return { state };
  }
}
