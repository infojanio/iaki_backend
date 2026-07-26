import { UsersRepository } from "@/repositories/prisma/Iprisma/users-repository";
import { AdminWithoutStoreError } from "@/utils/messages/errors/admin-without-store-error";
import { InvalidCredentialsError } from "@/utils/messages/errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { Role, Store } from "@prisma/client";
import { store } from "@/http/controllers/stores/store";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    storeId: string | null;
    store: {
      id: string;
      name: string;
      slug: string | null;
      avatar: string | null;
      isActive: boolean;
    } | null;
    avatar: string | null;
  };
}

// 🔐 Responsável APENAS pela autenticação
export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.passwordHash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    /**
     * 🔐 REGRA DE SEGURANÇA
     * ADMIN precisa estar vinculado a uma loja
     */
    if (user.role === "ADMIN" && !user.storeId) {
      throw new AdminWithoutStoreError();
    }

    /**
     * 🚀 Retorno LIMPO para JWT / frontend
     */
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        store: user.store,
        avatar: user.avatar,
      },
    };
  }
}
