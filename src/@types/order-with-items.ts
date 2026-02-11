import { Order, OrderItem, Product } from "@prisma/client";

export type OrderWithItemsAndProducts = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};
