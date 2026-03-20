import { Plan } from "@prisma/client";
import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";

interface ListPlansUseCaseResponse {
  plans: Plan[];
}

export class ListPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(): Promise<ListPlansUseCaseResponse> {
    const plans = await this.plansRepository.list();

    return { plans };
  }
}
