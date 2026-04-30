/*
  Warnings:

  - You are about to alter the column `billing_state` on the `vendors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(10)`.
  - You are about to alter the column `billing_country` on the `vendors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(2)`.
  - You are about to alter the column `shipping_state` on the `vendors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(10)`.
  - You are about to alter the column `shipping_country` on the `vendors` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE "items" ADD COLUMN     "unit_id" INTEGER;

-- AlterTable
ALTER TABLE "vendor_items_history" ADD COLUMN     "unit_id" INTEGER;

-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "billing_state" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "billing_country" SET DATA TYPE VARCHAR(2),
ALTER COLUMN "shipping_state" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "shipping_country" SET DATA TYPE VARCHAR(2);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" VARCHAR(100),
    "updated_by" VARCHAR(100),

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "units_code_key" ON "units"("code");

-- CreateIndex
CREATE INDEX "units_code_idx" ON "units"("code");

-- CreateIndex
CREATE INDEX "units_is_active_idx" ON "units"("is_active");

-- CreateIndex
CREATE INDEX "items_unit_id_idx" ON "items"("unit_id");

-- CreateIndex
CREATE INDEX "vendor_items_history_unit_id_idx" ON "vendor_items_history"("unit_id");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_items_history" ADD CONSTRAINT "vendor_items_history_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE SET NULL ON UPDATE CASCADE;
