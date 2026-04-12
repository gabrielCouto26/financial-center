CREATE TYPE "TransactionDirection" AS ENUM ('INCOME', 'EXPENSE');

ALTER TABLE "transactions"
ADD COLUMN "direction" "TransactionDirection" NOT NULL DEFAULT 'EXPENSE';
