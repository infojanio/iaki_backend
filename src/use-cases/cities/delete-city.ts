import { CitiesRepository } from "@/repositories/prisma/Iprisma/cities-repository";

interface DeleteCityUseCaseRequest {
  id: string;
}

export class DeleteCityUseCase {
  constructor(private citiesRepository: CitiesRepository) {}

  async execute({ id }: DeleteCityUseCaseRequest): Promise<void> {
    const cityExists = await this.citiesRepository.findById(id);

    if (!cityExists) {
      throw new Error("Cidade não encontrada!");
    }

    await this.citiesRepository.delete(id);
  }
}
