// http/routes/orders.ts
import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { createOrder } from "./create-order";
import { history } from "./history";
import { getCartByStoreController } from "../carts/get-cart-by-store";
import { getOrderByUser } from "./order-by-user";
import { getOrderByOrderId } from "./order-by-orderId";
import { getOrder } from "./get-order";
import { allOrdersHistory } from "./all-orders-history";
import { cancel } from "./cancel";
import { validateOrder } from "./validate-order";

export async function ordersRoutes(app: FastifyInstance) {
  /**
   * 🔐 JWT obrigatório para TODAS as rotas abaixo
   */
  app.addHook("onRequest", verifyJWT);

  /**
   * ============================
   * 👤 ROTAS DO USUÁRIO
   * ============================
   */

  // Criar pedido (checkout)
  app.post("/orders/checkout", createOrder);

  // Histórico do usuário autenticado
  app.get("/orders/history", history);

  // Buscar pedido específico
  app.get("/orders/:orderId", getOrderByOrderId);

  // (se ainda estiver usando)
  app.get("/order", getOrder);

  /**
   * ============================
   * 🏪 ROTAS DO ADMIN DA LOJA
   * ============================
   */

  // Listar pedidos da loja (PENDING / VALIDATED / EXPIRED)
  app.get(
    "/orders",
    { onRequest: [verifyUserRole("ADMIN")] },
    allOrdersHistory,
  );

  // Validar cashback
  app.patch(
    "/orders/:orderId/validate",
    { onRequest: [verifyUserRole("ADMIN")] },
    validateOrder,
  );

  // Cancelar pedido
  app.patch(
    "/orders/:orderId/cancel",
    { onRequest: [verifyUserRole("ADMIN")] },
    cancel,
  );
}
