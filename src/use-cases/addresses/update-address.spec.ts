import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { UpdateAddressUseCase } from "./update-address";
let addressesRepository: InMemoryAddressesRepository;
let sut: UpdateAddressUseCase;

describe("Update Address Use Case", () => {
  beforeEach(() => {
    addressesRepository = new InMemoryAddressesRepository();
    sut = new UpdateAddressUseCase(addressesRepository);
  });
  it("Deve ser possível atualizar um endereço existente.", async () => {
    // Arrange: Cria um endereço inicial
    const createdAddress = await addressesRepository.create({
      street: "Rua-01",
      city: "Campos Belos",
      state: "GO",
      postalCode: "73840-000",
      userId: "iiss211212",
      storeId: null,
      createdAt: new Date(),
    });
    console.log("Endereço original", createdAddress);
    // Act: Atualiza o endereço
    const { address } = await sut.execute({
      addressId: createdAddress.id,
      street: "Rua Nova",
      city: "Cidade Nova",
      postalCode: "73830-000",
      state: "GO",
      storeId: "4sdf1156332",
      userId: "124dfdf5533",
      createdAt: new Date(),
    });
    console.log("Endereço", address);

    // Assert: Verifica se os campos foram atualizados
    expect(address.street).toBe("Rua Nova");
    expect(address.city).toBe("Cidade Nova");
    expect(address.postalCode).toBe("73830-000");
    expect(address.state).toBe("GO"); // Não atualizado
    expect(address.storeId).toBe("4sdf1156332");
    expect(address.userId).toBe("124dfdf5533");
  });
  it("Deve lançar um erro se o endereço não existir.", async () => {
    await expect(
      sut.execute({
        addressId: "endereco-invalido",
        street: "Rua Nova",
        city: "Cidade Nova",
        postalCode: "73830-000",
        state: "TO",
        storeId: "4sdf1156332",
        userId: "124dfdf5533",
        createdAt: new Date(),
      }),
    ).rejects.toThrow("Endereço não encontrado.");
  });
});
