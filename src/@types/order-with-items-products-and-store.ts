// src/modules/orders/entities/OrderWithItemsProductsAndStore.ts

import { Decimal } from "@prisma/client/runtime/library";
import { OrderStatus } from "@prisma/client";

export type OrderWithItemsProductsAndStore = {
  id: string;
  user_id: string;
  store_id: string;
  totalAmount: Decimal;
  discountApplied: Decimal | null;
  qrCodeUrl: string | null;
  status: OrderStatus;
  validated_at: Date | null;
  created_at: Date;

  store: {
    id: string;
    name: string;
  };

  orderItems: {
    id: string;
    quantity: Decimal;
    product: {
      id: string;
      name: string;
      image: string | null;
      price: Decimal;
      cashback_percentage: number;
    };
  }[];
};
