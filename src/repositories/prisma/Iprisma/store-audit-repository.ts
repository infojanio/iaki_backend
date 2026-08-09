import {
  OrderStatus,
  RedemptionStatus,
  StorePointsTxType,
  SubscriptionStatus,
} from "@prisma/client";

export interface AuditOrder {
  id: string;
  userId: string;
  userName: string;

  totalAmount: number;
  discountApplied: number;

  status: OrderStatus;

  createdAt: Date;
  validatedAt: Date | null;

  pointsCredited: number;
  pointsTransactionsCount: number;
}

export interface AuditWallet {
  id: string;
  userId: string;
  userName: string;

  balance: number;
  earned: number;
  spent: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface AuditPointsTransaction {
  id: string;

  userId: string;
  userName: string;

  orderId: string | null;

  type: StorePointsTxType;

  points: number;

  note: string | null;

  createdAt: Date;
}

export interface AuditReward {
  id: string;
  title: string;

  pointsCost: number;
  stock: number;

  isActive: boolean;

  expiresAt: Date | null;
  createdAt: Date;
}

export interface AuditRedemption {
  id: string;

  rewardId: string;
  rewardTitle: string;

  userId: string;
  userName: string;

  points: number;

  status: RedemptionStatus;

  createdAt: Date;
  usedAt: Date | null;
}

export interface AuditProduct {
  id: string;
  name: string;

  price: number;
  quantity: number;

  minStock: number;

  status: boolean;

  createdAt: Date;
}

export interface AuditSubscription {
  id: string;

  status: SubscriptionStatus;

  startDate: Date;
  endDate: Date;

  isTrial: boolean;

  plan: {
    id: string;
    name: string;
    price: number;
  };
}

export interface StoreAuditData {
  store: {
    id: string;
    name: string;

    cnpj: string | null;

    isActive: boolean;

    city: string;
    state: string;

    createdAt: Date;
  };

  admin: {
    id: string;
    name: string;
    email: string;
  } | null;

  orders: AuditOrder[];

  wallets: AuditWallet[];

  transactions: AuditPointsTransaction[];

  rewards: AuditReward[];

  redemptions: AuditRedemption[];

  products: AuditProduct[];

  subscription: AuditSubscription | null;
}

export interface StoreAuditRepository {
  getStoreAuditData(
    storeId: string,
    adminId: string,
    from?: Date,
    to?: Date,
  ): Promise<StoreAuditData | null>;
}
