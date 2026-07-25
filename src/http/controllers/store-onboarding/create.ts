import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateStoreOnboardingUseCase } from "@/use-cases/_factories/make-create-store-onboarding-use-case";

const optionalUrl = z
  .string()
  .trim()
  .url("Informe uma URL válida.")
  .optional()
  .or(z.literal(""));

const bodySchema = z.object({
  store: z.object({
    name: z.string().trim().min(1),
    slug: optionalUrl,
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    phone: z.string().trim().min(8),
    cnpj: z.string().trim().min(14),
    avatar: optionalUrl,
    street: z.string().trim().min(1),
    postalCode: z.string().trim().min(8),
    cityId: z.string().uuid(),
  }),
  user: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(8),
    cpf: z.string().trim().min(11),
    password: z.string().min(6),
    avatar: optionalUrl,
    street: z.string().trim().min(1),
    state: z.string().trim().min(1),
    postalCode: z.string().trim().min(8),
  }),
});

type Body = z.infer<typeof bodySchema>;

export async function createStoreOnboarding(
  request: FastifyRequest<{ Body: Body }>,
  reply: FastifyReply,
) {
  const body = bodySchema.parse(request.body);
  const result = await makeCreateStoreOnboardingUseCase().execute(body);

  return reply.status(201).send({
    message: result.emailSent
      ? "Loja e usuário cadastrados com sucesso."
      : "Loja e usuário cadastrados com sucesso. O e-mail de confirmação não pôde ser enviado.",
    store: {
      id: result.store.id,
      name: result.store.name,
      isActive: result.store.isActive,
    },
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      storeId: result.user.storeId,
    },

    emailSent: result.emailSent,
  });
}
