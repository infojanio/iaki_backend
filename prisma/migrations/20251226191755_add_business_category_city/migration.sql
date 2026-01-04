/*
  Warnings:

  - You are about to drop the column `cityId` on the `business_categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `stores` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `business_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "business_categories" DROP CONSTRAINT "business_categories_cityId_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_category_id_fkey";

-- DropIndex
DROP INDEX "business_categories_name_cityId_key";

-- AlterTable
ALTER TABLE "business_categories" DROP COLUMN "cityId";

-- AlterTable
ALTER TABLE "stores" DROP COLUMN "category_id";

-- CreateTable
CREATE TABLE "business_category_cities" (
    "id" TEXT NOT NULL,
    "business_category_id" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "business_category_cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_business_categories" (
    "id" TEXT NOT NULL,
    "store_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "store_business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_category_cities_business_category_id_city_id_key" ON "business_category_cities"("business_category_id", "city_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_business_categories_store_id_category_id_key" ON "store_business_categories"("store_id", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_name_key" ON "business_categories"("name");

-- AddForeignKey
ALTER TABLE "business_category_cities" ADD CONSTRAINT "business_category_cities_business_category_id_fkey" FOREIGN KEY ("business_category_id") REFERENCES "business_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_category_cities" ADD CONSTRAINT "business_category_cities_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_business_categories" ADD CONSTRAINT "store_business_categories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_business_categories" ADD CONSTRAINT "store_business_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "business_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
