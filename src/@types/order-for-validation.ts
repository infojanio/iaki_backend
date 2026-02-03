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
  user_id: string;
  store_id: string;
  status: OrderStatus;
  created_at: Date;
  discountApplied: Decimal;
  items: OrderItemSnapshot[];
}
