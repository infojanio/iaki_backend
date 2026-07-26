import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateStoreOnboardingUseCase } from "@/use-cases/_factories/make-create-store-onboarding-use-case";
import isValidCPF from "@/utils/IsValidCPF";

const optionalUrl = z
  .string()
  .trim()
  .url("Informe uma URL válida.")
  .optional()
  .or(z.literal(""));

/*
    name: z.string(),
    phone: z.string(),
    slug: z.string(),
    isActive: z.boolean().default(true),
    latitude: z.number(),
    longitude: z.number(),
    cnpj: z.string(),
    avatar: z.string(),
    street: z.string(),
    postalCode: z.string(),
    cityId: z.string().uuid(),
*/

const bodySchema = z.object({
  plan: z.string().trim().min(1, "Selecione um plano."),
  store: z.object({
    name: z.string().trim().min(1),
    slug: optionalUrl,
    latitude: z.number(),
    longitude: z.number(),
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
    cpf: z.string().refine(isValidCPF, {
      message: "CPF inválido",
    }),
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
    subscription: {
      id: result.subscription.id,
      status: result.subscription.status,
      startAt: result.subscription.startDate,
      endAt: result.subscription.endDate,
    },
    emailSent: result.emailSent,
  });
}
