-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "account_id" VARCHAR(50),
    "account_type" VARCHAR(50) NOT NULL,
    "account_name" VARCHAR(200) NOT NULL,
    "account_code" VARCHAR(20),
    "parent_account_id" INTEGER,
    "description" TEXT,
    "account_hint" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "account_type_int" INTEGER,
    "schedule_balancesheet_category" VARCHAR(100),
    "schedule_profit_and_loss_category" VARCHAR(100),
    "is_tax_account" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_primary_account" BOOLEAN NOT NULL DEFAULT false,
    "is_root_account_with_child" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_account_id_key" ON "accounts"("account_id");

-- CreateIndex
CREATE INDEX "accounts_account_id_idx" ON "accounts"("account_id");

-- CreateIndex
CREATE INDEX "accounts_account_type_idx" ON "accounts"("account_type");

-- CreateIndex
CREATE INDEX "accounts_account_name_idx" ON "accounts"("account_name");

-- CreateIndex
CREATE INDEX "accounts_parent_account_id_idx" ON "accounts"("parent_account_id");

-- CreateIndex
CREATE INDEX "accounts_is_active_idx" ON "accounts"("is_active");

-- CreateIndex
CREATE INDEX "accounts_is_tax_account_idx" ON "accounts"("is_tax_account");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_parent_account_id_fkey" FOREIGN KEY ("parent_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: Add new account reference columns to items table
ALTER TABLE "items" ADD COLUMN "sales_account_id" INTEGER;
ALTER TABLE "items" ADD COLUMN "purchase_account_id" INTEGER;

-- CreateIndex
CREATE INDEX "items_sales_account_id_idx" ON "items"("sales_account_id");

-- CreateIndex
CREATE INDEX "items_purchase_account_id_idx" ON "items"("purchase_account_id");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_sales_account_id_fkey" FOREIGN KEY ("sales_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_purchase_account_id_fkey" FOREIGN KEY ("purchase_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
