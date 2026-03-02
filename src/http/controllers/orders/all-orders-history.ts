// src/http/controllers/orders/admin/history.ts

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchAllOrdersHistoryUseCase } from "@/use-cases/_factories/make-fetch-all-orders-history-use-case";

export async function allOrdersHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  /**
   * 🔐 1. Autenticação (JWT válido)
   */
  if (!request.user) {
    return reply.status(401).send({
      message: "Sessão expirada. Faça login novamente.",
    });
  }

  /**
   * 🔐 2. Autorização (ADMIN com loja)
   */
  const storeId = request.user.storeId;

  if (!storeId) {
    return reply.status(403).send({
      message: "Administrador não vinculado a nenhuma loja.",
    });
  }

  /**
   * 📥 3. Query params permitidos
   */
  const orderHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    status: z.enum(["PENDING", "VALIDATED", "EXPIRED"]).optional(),
  });

  try {
    const { page, status } = orderHistoryQuerySchema.parse(request.query);

    const fetchAllOrdersHistoryUseCase = makeFetchAllOrdersHistoryUseCase();

    const { orders } = await fetchAllOrdersHistoryUseCase.execute({
      page,
      status,
      storeId,
    });

    return reply.status(200).send({
      orders: orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        user_name: order.user_name,
        storeId: order.storeId,
        totalAmount: order.totalAmount,
        discountApplied: order.discountApplied,
        status: order.status,
        qrCodeUrl: order.qrCodeUrl,
        validatedAt: order.validatedAt,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          quantity: item.quantity,
          product: item.product
            ? {
                id: item.product.id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                cashbackPercentage: item.product.cashbackPercentage,
              }
            : null,
        })),
      })),
    });
  } catch (err) {
    console.error("[ALL ORDERS HISTORY ERROR]", err);

    return reply.status(500).send({
      message: "Erro ao buscar pedidos da loja.",
    });
  }
}
