import { InMemoryCashbacksBalanceRepository } from "@/repositories/in-memory/in-memory-cashbacks-balance-repository";
import { GetUserCashbackBalanceUseCase } from "./get-user-cashback-balance";
import { expect, describe, it, beforeEach } from "vitest";
import { Prisma } from "@prisma/client";

let cashbacksRepository: InMemoryCashbacksBalanceRepository;
let sut: GetUserCashbackBalanceUseCase;

describe("Get User Cashback Balance Use Case", () => {
  beforeEach(() => {
    cashbacksRepository = new InMemoryCashbacksBalanceRepository();
    sut = new GetUserCashbackBalanceUseCase(cashbacksRepository);
  });

  it("Deve calcular o saldo total de cashback do usuário", async () => {
    cashbacksRepository.items.push(
      {
        id: "1",
        userId: "user-1",
        orderId: "order-1",
        amount: new Prisma.Decimal(50),
        credited_at: new Date(),
      },
      {
        id: "2",
        userId: "user-1",
        orderId: "order-2",
        amount: new Prisma.Decimal(-20),
        credited_at: new Date(),
      },
      {
        id: "3",
        userId: "user-1",
        orderId: "order-3",
        amount: new Prisma.Decimal(30),
        credited_at: new Date(),
      },
    );

    const { balance } = await sut.execute({ userId: "user-1" });
    expect(balance).toBe(60); // 50 + 30 - 20 = 60
    console.log("Saldo:", balance.toString()); // Garantindo que seja impresso corretamente
  });

  it("Deve retornar saldo zero para um usuário sem cashback", async () => {
    const { balance } = await sut.execute({ userId: "user-2" });

    expect(balance).toBe(0);
  });
});
