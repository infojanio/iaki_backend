import {
  PrismaClient,
  Role,
  OrderStatus,
  CashbackStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  /* ===========================
     STATE + CITY
  ============================ */
  const state = await prisma.state.create({
    data: {
      name: "Goiás",
      uf: "GO",
    },
  });

  const city = await prisma.city.create({
    data: {
      name: "Campos Belos",
      stateId: state.id,
    },
  });

  /* ===========================
     BUSINESS CATEGORIES
  ============================ */
  const foodCategory = await prisma.businessCategory.create({
    data: {
      name: "Alimentação",
      image: "https://placehold.co/300x300",
    },
  });

  const marketCategory = await prisma.businessCategory.create({
    data: {
      name: "Mercado",
      image: "https://placehold.co/300x300",
    },
  });

  await prisma.businessCategoryCity.createMany({
    data: [
      { businessCategoryId: foodCategory.id, cityId: city.id },
      { businessCategoryId: marketCategory.id, cityId: city.id },
    ],
  });

  /* ===========================
     STORE
  ============================ */
  const store = await prisma.store.create({
    data: {
      name: "Supermercado Central",
      slug: "supermercado-central",
      latitude: -13.034,
      longitude: -46.768,
      cityId: city.id,
      phone: "62999999999",
      isActive: true,
    },
  });

  await prisma.storeBusinessCategory.createMany({
    data: [{ storeId: store.id, categoryId: marketCategory.id }],
  });

  /* ===========================
     USER + ADMIN
  ============================ */
  const passwordHash = await bcrypt.hash("123456", 8);

  const user = await prisma.user.create({
    data: {
      name: "Usuário Teste",
      email: "user@test.com",
      passwordHash,
      role: Role.USER,
      cityId: city.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Loja",
      email: "admin@test.com",
      passwordHash,
      role: Role.ADMIN,
      storeId: store.id,
      cityId: city.id,
    },
  });

  /* ===========================
     CATEGORY + SUBCATEGORY
  ============================ */
  const category = await prisma.category.create({
    data: {
      name: "Bebidas",
    },
  });

  const subCategory = await prisma.subCategory.create({
    data: {
      name: "Refrigerantes",
      categoryId: category.id,
    },
  });

  await prisma.storeCategory.create({
    data: {
      storeId: store.id,
      categoryId: category.id,
    },
  });

  /* ===========================
     PRODUCTS
  ============================ */
  const product1 = await prisma.product.create({
    data: {
      name: "Coca-Cola 2L",
      description: "Refrigerante Coca-Cola 2 litros",
      price: 10,
      quantity: 100,
      cashbackPercentage: 5,
      status: true,
      storeId: store.id,
      subcategoryId: subCategory.id,
      image: "https://placehold.co/400x400",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Guaraná Antártica 2L",
      price: 8,
      quantity: 80,
      cashbackPercentage: 3,
      status: true,
      storeId: store.id,
      subcategoryId: subCategory.id,
      image: "https://placehold.co/400x400",
    },
  });

  /* ===========================
     BANNERS
  ============================ */
  await prisma.banner.create({
    data: {
      title: "Ofertas da Semana",
      imageUrl: "https://placehold.co/1200x400",
      storeId: store.id,
      isActive: true,
      position: 1,
    },
  });

  /* ===========================
     REELS
  ============================ */
  await prisma.reel.create({
    data: {
      title: "Promoção Relâmpago",
      imageUrl: "https://placehold.co/500x800",
      link: "https://google.com",
      storeId: "",
    },
  });

  /* ===========================
     COUPON
  ============================ */
  await prisma.coupon.create({
    data: {
      code: "BEMVINDO10",
      storeId: store.id,
      type: "PERCENT",
      value: 10,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  /* ===========================
     ORDER + ORDER ITEMS
  ============================ */
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      storeId: store.id,
      totalAmount: 18,
      discountApplied: 0,
      status: OrderStatus.VALIDATED,
      validatedAt: new Date(),
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: product1.id,
        quantity: 1,
        subtotal: 10,
      },
      {
        orderId: order.id,
        productId: product2.id,
        quantity: 1,
        subtotal: 8,
      },
    ],
  });

  /* ===========================
     CASHBACK
  ============================ */
  await prisma.cashback.create({
    data: {
      userId: user.id,
      storeId: store.id,
      orderId: order.id,
      amount: 0.9,
      validated: true,
      creditedAt: new Date(),
      status: CashbackStatus.CONFIRMED,
    },
  });

  /* ===========================
     PLANS
  ============================ */
  const plans = [
    {
      name: "FREE",
      price: 0,
      durationDays: 30,
      maxProducts: 20,
      maxBanners: 0,
      maxReels: 0,
      maxCategories: 2,
      isActive: true,
    },
    {
      name: "PRO",
      price: 99.9,
      durationDays: 30,
      maxProducts: 200,
      maxBanners: 10,
      maxReels: 10,
      maxCategories: 10,
      isActive: true,
    },
    {
      name: "PREMIUM",
      price: 199.9,
      durationDays: 30,
      maxProducts: null,
      maxBanners: null,
      maxReels: null,
      maxCategories: null,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        price: plan.price,
        durationDays: plan.durationDays,
        maxProducts: plan.maxProducts,
        maxBanners: plan.maxBanners,
        maxReels: plan.maxReels,
        maxCategories: plan.maxCategories,
        isActive: plan.isActive,
      },
      create: plan,
    });
  }

  /* ===========================
     MISSIONS
  ============================ */
  await prisma.mission.create({
    data: {
      title: "Faça sua primeira compra",
      description: "Ganhe desconto na próxima compra",
      type: "ORDERS_COUNT",
      target: 1,
      rewardType: "DISCOUNT",
      rewardValue: 5,
    },
  });

  console.log("✅ Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
