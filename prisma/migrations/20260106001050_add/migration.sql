-- AlterTable
ALTER TABLE "business_categories" ADD COLUMN     "storeId" TEXT;

-- AlterTable
ALTER TABLE "stores" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "ratingCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
