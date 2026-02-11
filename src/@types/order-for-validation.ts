import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface OrderItemSnapshot {
  id: string;
  quantity: number;
  priceSnapshot: Decimal;
  cashbackSnapshot: Decimal;
}

export interface OrderForValidation {
  id: string;
  userId: string;
  storeId: string;
  status: OrderStatus;
  createdAt: Date;
  discountApplied: Decimal;
  items: OrderItemSnapshot[];
}
