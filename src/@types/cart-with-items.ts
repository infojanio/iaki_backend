import { Cart, CartItem, Product, Store } from "@prisma/client";

export type CartWithItems = Cart & {
  store: Store;
  items: (CartItem & {
    product: Product;
  })[];
};
