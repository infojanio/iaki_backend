import { Plan } from "@prisma/client";
import { PlansRepository } from "@/repositories/prisma/Iprisma/plans-repository";
import { PlanAlreadyExistsError } from "@/utils/messages/errors/plan-already-exists-error";
import { PlanNotFoundError } from "@/utils/messages/errors/plan-not-found-error";

interface UpdatePlanUseCaseRequest {
  id: string;
  name?: string;
  price?: number;
  durationDays?: number;
  maxProducts?: number | null;
  maxBanners?: number | null;
  maxReels?: number | null;
  maxCategories?: number | null;
  isActive?: boolean;
}

interface UpdatePlanUseCaseResponse {
  plan: Plan;
}

export class UpdatePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    id,
    name,
    price,
    durationDays,
    maxProducts,
    maxBanners,
    maxReels,
    maxCategories,
    isActive,
  }: UpdatePlanUseCaseRequest): Promise<UpdatePlanUseCaseResponse> {
    const existingPlan = await this.plansRepository.findById(id);

    if (!existingPlan) {
      throw new PlanNotFoundError();
    }

    if (name && name !== existingPlan.name) {
      const planWithSameName = await this.plansRepository.findByName(name);

      if (planWithSameName) {
        throw new PlanAlreadyExistsError();
      }
    }

    const plan = await this.plansRepository.update(id, {
      ...(name !== undefined ? { name } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(durationDays !== undefined ? { durationDays } : {}),
      ...(maxProducts !== undefined ? { maxProducts } : {}),
      ...(maxBanners !== undefined ? { maxBanners } : {}),
      ...(maxReels !== undefined ? { maxReels } : {}),
      ...(maxCategories !== undefined ? { maxCategories } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    });

    return { plan };
  }
}
