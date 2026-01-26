import { prisma } from "@/lib/prisma";
import { StoreEvaluationsRepository } from "@/repositories/prisma/Iprisma/store-evaluations-repository";
import { StoresRepository } from "@/repositories/prisma/Iprisma/stores-repository";
import { StoreEvaluation } from "@prisma/client";

interface CreateStoreEvaluationUseCaseRequest {
  userId: string;
  storeId: string;
  rating: number;
}

interface CreateStoreEvaluationUseCaseResponse {
  evaluation: StoreEvaluation;
}

export class CreateStoreEvaluationUseCase {
  constructor(
    private storeEvaluationsRepository: StoreEvaluationsRepository,
    private storesRepository: StoresRepository,
  ) {}

  async execute({
    userId,
    storeId,
    rating,
  }: CreateStoreEvaluationUseCaseRequest): Promise<CreateStoreEvaluationUseCaseResponse> {
    if (rating < 1 || rating > 5) {
      throw new Error("Avaliação deve ser entre 1 e 5 estrelas");
    }

    const store = await this.storesRepository.findById(storeId);

    if (!store) {
      throw new Error("Loja não encontrada");
    }

    const alreadyRated =
      await this.storeEvaluationsRepository.findByUserAndStore(userId, storeId);

    if (alreadyRated) {
      throw new Error("Você já avaliou esta loja");
    }

    //calculo da média de avaliações
    const newRating =
      (store.rating * store.ratingCount + rating) / (store.ratingCount + 1);

    let evaluation: StoreEvaluation;

    await prisma.$transaction(async (tx) => {
      evaluation = await tx.storeEvaluation.create({
        data: {
          userId,
          storeId,
          rating,
        },
      });

      await tx.store.update({
        where: { id: storeId },
        data: {
          rating: newRating,
          ratingCount: store.ratingCount + 1,
        },
      });
    });

    // @ts-ignore (evaluation é definido dentro da transaction)
    return { evaluation };
  }
}
