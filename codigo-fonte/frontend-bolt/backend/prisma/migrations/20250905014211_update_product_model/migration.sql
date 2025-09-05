/*
  Warnings:

  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
-- First, add new columns
ALTER TABLE "public"."products" 
ADD COLUMN     "barcode" TEXT,
ADD COLUMN     "costPrice" DOUBLE PRECISION,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "minStockLevel" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Copy stock data to stockQuantity and then drop stock
UPDATE "public"."products" SET "stockQuantity" = COALESCE("stock", 0);
ALTER TABLE "public"."products" DROP COLUMN "stock";

-- Handle category conversion - convert enum to text
ALTER TABLE "public"."products" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "public"."products"("sku");
