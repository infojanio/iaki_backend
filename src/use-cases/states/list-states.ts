import { State } from "@prisma/client";
import { StatesRepository } from "@/repositories/prisma/Iprisma/states-repository";

interface ListStatesUseCaseResponse {
  states: State[];
}

export class ListStatesUseCase {
  constructor(private statesRepository: StatesRepository) {}

  async execute(): Promise<ListStatesUseCaseResponse> {
    const states = await this.statesRepository.findMany();
    return { states };
  }
}
