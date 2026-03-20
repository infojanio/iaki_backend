import { Plan } from "@prisma/client";
import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { PlanAlreadyExistsError } from "@/utils/messages/errors/plan-already-exists-error";

interface CreatePlanUseCaseRequest {
  name: string;
  price: number;
  durationDays: number;
  maxProducts?: number | null;
  maxBanners?: number | null;
  maxReels?: number | null;
  maxCategories?: number | null;
  isActive?: boolean;
}

interface CreatePlanUseCaseResponse {
  plan: Plan;
}

export class CreatePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    name,
    price,
    durationDays,
    maxProducts,
    maxBanners,
    maxReels,
    maxCategories,
    isActive = true,
  }: CreatePlanUseCaseRequest): Promise<CreatePlanUseCaseResponse> {
    const existingPlan = await this.plansRepository.findByName(name);

    if (existingPlan) {
      throw new PlanAlreadyExistsError();
    }

    const plan = await this.plansRepository.create({
      name,
      price,
      durationDays,
      maxProducts: maxProducts ?? null,
      maxBanners: maxBanners ?? null,
      maxReels: maxReels ?? null,
      maxCategories: maxCategories ?? null,
      isActive,
    });

    return { plan };
  }
}
