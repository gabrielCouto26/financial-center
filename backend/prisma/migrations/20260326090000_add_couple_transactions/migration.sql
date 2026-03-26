-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PERSONAL', 'COUPLE');

-- CreateTable
CREATE TABLE "couple_links" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couple_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couple_link_members" (
    "id" TEXT NOT NULL,
    "couple_link_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "couple_link_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_splits" (
    "id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transaction_splits_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "transactions"
ADD COLUMN "type" "TransactionType" NOT NULL DEFAULT 'PERSONAL',
ADD COLUMN "paid_by_user_id" TEXT,
ADD COLUMN "couple_link_id" TEXT;

-- Backfill payer with the original transaction creator.
UPDATE "transactions"
SET "paid_by_user_id" = "user_id";

-- AlterTable
ALTER TABLE "transactions"
ALTER COLUMN "paid_by_user_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "couple_link_members_user_id_key" ON "couple_link_members"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "couple_link_members_couple_link_id_user_id_key" ON "couple_link_members"("couple_link_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_splits_transaction_id_user_id_key" ON "transaction_splits"("transaction_id", "user_id");

-- AddForeignKey
ALTER TABLE "couple_link_members" ADD CONSTRAINT "couple_link_members_couple_link_id_fkey" FOREIGN KEY ("couple_link_id") REFERENCES "couple_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "couple_link_members" ADD CONSTRAINT "couple_link_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_paid_by_user_id_fkey" FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_couple_link_id_fkey" FOREIGN KEY ("couple_link_id") REFERENCES "couple_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_splits" ADD CONSTRAINT "transaction_splits_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_splits" ADD CONSTRAINT "transaction_splits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
