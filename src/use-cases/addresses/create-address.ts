import { AddressesRepository } from "@/repositories/prisma/Iprisma/addresses-repository";
import { Address, Prisma } from "@prisma/client";
interface CreateAddressUseCaseRequest {
  id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  storeId?: string | null;
  userId?: string | null;
  //createdAt: Date
}
interface CreateAddressUseCaseResponse {
  address: Address;
}
export class CreateAddressUseCase {
  constructor(private addressesRepository: AddressesRepository) {}
  async execute({
    id,
    street,
    city,
    state,
    postalCode,
    storeId,
    userId,
  }: // createdAt,
  CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = await this.addressesRepository.create({
      id,
      street,
      city,
      state,
      postalCode,
      storeId,
      userId,
      //  createdAt,
    });
    return { address };
  }
}
