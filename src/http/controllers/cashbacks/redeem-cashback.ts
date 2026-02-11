// http/cashbacks/redeem-cashback.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeRedeemCashbackUseCase } from "@/use-cases/_factories/make-redeem-cashback-use-case";

export async function redeemCashback(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    orderId: z.string(),
    amount: z.number().positive("O saldo deve ser positivo!"),
  });

  const { orderId, amount } = bodySchema.parse(request.body);

  const redeemCashbackUseCase = makeRedeemCashbackUseCase();

  await redeemCashbackUseCase.execute({
    userId: request.user.sub,
    orderId,
    amount,
  });

  return reply.status(201).send({ message: "Cashback redeemed successfully." });
}
