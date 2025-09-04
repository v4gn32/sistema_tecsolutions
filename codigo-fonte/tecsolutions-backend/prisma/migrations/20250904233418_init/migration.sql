/*
  Warnings:

  - The values [ONE_TIME] on the enum `ClientType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `Proposal` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Proposal` table. All the data in the column will be lost.
  - The primary key for the `ProposalItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `ProposalItem` table. All the data in the column will be lost.
  - You are about to drop the column `lineTotal` on the `ProposalItem` table. All the data in the column will be lost.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hourlyRate` on the `Service` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `Proposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ProposalItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TECH');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('ONSITE', 'REMOTE', 'LAB');

-- CreateEnum
CREATE TYPE "ProposalItemType" AS ENUM ('PRODUCT', 'SERVICE');

-- AlterEnum
BEGIN;
CREATE TYPE "ClientType_new" AS ENUM ('CONTRACT', 'SPOT');
ALTER TABLE "Client" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Client" ALTER COLUMN "type" TYPE "ClientType_new" USING ("type"::text::"ClientType_new");
ALTER TYPE "ClientType" RENAME TO "ClientType_old";
ALTER TYPE "ClientType_new" RENAME TO "ClientType";
DROP TYPE "ClientType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ProposalItem" DROP CONSTRAINT "ProposalItem_proposalId_fkey";

-- DropIndex
DROP INDEX "Proposal_code_key";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "type" DROP DEFAULT,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Client_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "stock",
DROP COLUMN "unit",
ADD COLUMN     "description" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "Proposal" DROP CONSTRAINT "Proposal_pkey",
DROP COLUMN "code",
DROP COLUMN "createdById",
DROP COLUMN "expiresAt",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "clientId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Proposal_id_seq";

-- AlterTable
ALTER TABLE "ProposalItem" DROP CONSTRAINT "ProposalItem_pkey",
DROP COLUMN "description",
DROP COLUMN "lineTotal",
ADD COLUMN     "productId" TEXT,
ADD COLUMN     "serviceId" TEXT,
ADD COLUMN     "total" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "type" "ProposalItemType" NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "proposalId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProposalItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProposalItem_id_seq";

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "hourlyRate",
ADD COLUMN     "unitPrice" DECIMAL(12,2) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Service_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "password",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'TECH',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hours" DECIMAL(12,2) NOT NULL,
    "materials" TEXT,
    "description" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_clientId_idx" ON "Report"("clientId");

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "ProposalItem_proposalId_idx" ON "ProposalItem"("proposalId");

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProposalItem" ADD CONSTRAINT "ProposalItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
