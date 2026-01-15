import { Order, OrderItem, Product } from "@prisma/client";

export type OrderWithItemsAndProducts = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
};
