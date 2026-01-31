// src/modules/cart/entities/OpenCartWithItems.ts

import { Decimal } from "@prisma/client/runtime/library";

export type OpenCartWithItems = {
  id: string;
  userId: string;
  storeId: string;
  status: "OPEN";
  createdAt: Date;
  updatedAt: Date;
  store: {
    id: string;
    name: string;
  };
  items: {
    id: string;
    productId: string;
    quantity: number;
    priceSnapshot: Decimal;
    cashbackSnapshot: number;
    product: {
      id: string;
      name: string;
      price: Decimal;
      image: string | null;
      cashback_percentage: number;
    };
  }[];
};
