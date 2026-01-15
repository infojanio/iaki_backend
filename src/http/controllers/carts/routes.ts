import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";

import { getCartByStoreController } from "./get-cart-by-store";

import { removeItemFromCart } from "./remove-item-from-cart";
import { addToCartController } from "./add-to-cart";
import { checkoutController } from "./checkout";
import { decrementCartItem } from "./decrement-cart-item";
import { incrementCartItem } from "./increment-cart-item";
import { getCartSummaryByStore } from "./get-cart-summary-by-store";

export async function cartsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  // Buscar carrinho do usuário autenticado

  app.get("/cart/store/:storeId", getCartByStoreController);

  app.get("/cart/store/:storeId/summary", getCartSummaryByStore);

  // Adicionar item ao carrinho
  app.post("/cart/items", addToCartController);

  // Remover item específico do carrinho
  app.delete("/cart/items/:productId", removeItemFromCart);

  // ➕ Incrementar quantidade
  app.patch("/cart/items/increment", incrementCartItem);

  // ➖ Decrementar quantidade
  app.patch("/cart/items/decrement", decrementCartItem);

  // Checkout do carrinho
  app.post("/cart/checkout", checkoutController);
}
