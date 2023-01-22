-- CreateEnum
CREATE TYPE "CoinType" AS ENUM ('FIDUCIARY', 'FICTITIOUS', 'CRYPTO');

-- CreateTable
CREATE TABLE "coins" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "high" TEXT NOT NULL,
    "low" TEXT NOT NULL,
    "type" "CoinType" NOT NULL DEFAULT 'FIDUCIARY',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "coins_code_key" ON "coins"("code");
