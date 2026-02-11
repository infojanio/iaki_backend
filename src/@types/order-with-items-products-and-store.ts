// src/modules/orders/entities/OrderWithItemsProductsAndStore.ts

import { Decimal } from "@prisma/client/runtime/library";
import { OrderStatus } from "@prisma/client";

export type OrderWithItemsProductsAndStore = {
  id: string;
  userId: string;
  storeId: string;
  totalAmount: Decimal;
  discountApplied: Decimal | null;
  qrCodeUrl: string | null;
  status: OrderStatus;
  validatedAt: Date | null;
  createdAt: Date;

  store: {
    id: string;
    name: string;
  };

  items: {
    id: string;
    quantity: Decimal;
    product: {
      id: string;
      name: string;
      image: string | null;
      price: Decimal;
      cashbackPercentage: number;
    };
  }[];
};
